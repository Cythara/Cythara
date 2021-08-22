from rest_framework.views import APIView
from pathlib import Path
from rest_framework.response import Response
from rest_framework import status, generics
from django.contrib.auth import authenticate, login, logout
from api.serializers import DuelSerializer, GenreSerializer, LeaderSerializer, VoteSerializer
from .models import Duel, Genre, TrackCodes, User, Vote
import music.generate
import music.utils
from cythara.settings import MEDIA_ROOT, MEDIA_URL
import datetime
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile


class CreateDuel(APIView):
    def post(self, request, format=None):
        if not request.user.is_authenticated:
            return Response({'Unauthorized': 'User not logged in.'},
                            status=status.HTTP_401_UNAUTHORIZED)

        user_matches = User.objects.filter(username=request.user.username)
        if not user_matches.exists():
            return Response({'Unauthorized': 'No such user.'},
                            status=status.HTTP_401_UNAUTHORIZED)

        if 'genre' not in request.data:
            return Response({'Bad request': 'Invalid data'},
                            status=status.HTTP_400_BAD_REQUEST)

        genre = request.data.get('genre')

        genre_matches = Genre.objects.filter(genre_name=genre)
        if not genre_matches.exists():
            return Response({'Not found': 'Genre does not exist'},
                            status=status.HTTP_404_NOT_FOUND)

        player_1 = user_matches[0]
        if player_1.duel_code:
            if Duel.objects.filter(code=player_1.duel_code).exists():
                return Response({'Invalid': 'User is already in a duel.'},
                                status=status.HTTP_409_CONFLICT)

        duel = Duel(player_1=player_1, genre=genre_matches[0])
        duel.save()

        player_1.duel_code = duel.code
        player_1.save(update_fields=['duel_code'])

        TrackCodes(duel=duel).save()

        return Response(DuelSerializer(duel).data, status=status.HTTP_200_OK)


class GetDuel(APIView):
    def get(self, request, format=None):
        if 'code' not in request.data:
            return Response({'Bad request': 'Invalid data'},
                            status=status.HTTP_400_BAD_REQUEST)

        code = request.data.get('code')

        duel_matches = Duel.objects.filter(code=code)
        if not duel_matches.exists():
            return Response({'Duel not found:': 'Invalid Duel Code'},
                            status=status.HTTP_404_NOT_FOUND)

        duel = duel_matches[0]
        return Response(data=DuelSerializer(duel).data,
                        status=status.HTTP_200_OK)


class ListDuels(generics.ListAPIView):
    queryset = Duel.objects.all()
    serializer_class = DuelSerializer


class ListGenres(generics.ListAPIView):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer


class JoinDuel(APIView):
    def post(self, request, format=None):
        if not request.user.is_authenticated:
            return Response({'Unauthorized': 'User not logged in.'},
                            status=status.HTTP_401_UNAUTHORIZED)

        user_matches = User.objects.filter(username=request.user.username)
        if not user_matches.exists():
            return Response({'Bad Request': 'Invalid User'},
                            status=status.HTTP_401_UNAUTHORIZED)

        if 'code' not in request.data or 'play' not in request.data:
            return Response({'Bad request': 'Invalid data'},
                            status=status.HTTP_400_BAD_REQUEST)

        code = request.data.get('code')
        play = request.data.get('play')

        duel_matches = Duel.objects.filter(code=code)
        if not duel_matches.exists():
            return Response({'Not found': 'No such room.'},
                            status=status.HTTP_404_NOT_FOUND)

        user = user_matches[0]
        duel = duel_matches[0]

        if play:
            if duel.status != Duel.JOINING:
                return Response({'Did not join': 'Duel taken.'},
                                status=status.HTTP_409_CONFLICT)
            duel.player_2 = user
            duel.status = Duel.RECORDING
            duel.save(update_fields=['player_2', 'status'])

        user.duel_code = duel.code
        user.save(update_fields=['duel_code'])

        return Response(DuelSerializer(duel).data, status=status.HTTP_200_OK)


class AddVoteDuel(APIView):
    def post(self, request, format=None):
        if not request.user.is_authenticated:
            return Response({'Unauthorized': 'User not logged in.'},
                            status=status.HTTP_401_UNAUTHORIZED)

        user_matches = User.objects.filter(username=request.user.username)
        if not user_matches.exists():
            return Response({'Unauthorized': 'No such user.'},
                            status=status.HTTP_401_UNAUTHORIZED)
        user = user_matches[0]

        if 'player' not in request.data:
            return Response({'Bad request': 'Invalid data'},
                            status=status.HTTP_400_BAD_REQUEST)
        player = request.data.get('player')
        duel_code = user.duel_code

        duel_matches = Duel.objects.filter(code=duel_code)
        if not duel_matches.exists():
            return Response({'Not found': 'No such duel.'},
                            status=status.HTTP_404_NOT_FOUND)
        duel = duel_matches[0]

        if False and duel.status != Duel.VOTING:
            return Response({'Forbidden: ': 'Cannot vote now.'},
                            status=status.HTTP_403_FORBIDDEN)

        if user in [duel.player_1, duel.player_2]: 
            return Response({'Unauthorized': 'User not in audience.'},
                            status=status.HTTP_401_UNAUTHORIZED)

        if player not in [1, 2]:
            return Response({'Bad request': 'player should be 1 or 2'},
                            status=status.HTTP_400_BAD_REQUEST)

        if Vote.objects.filter(user=user).exists():
            return Response({'Forbidden': 'Cannot vote twice'},
                            status=status.HTTP_403_FORBIDDEN)

        vote = Vote(duel=duel, user=user, player=player)
        vote.save()

        return Response(VoteSerializer(vote).data, status=status.HTTP_200_OK)


class RegisterUser(APIView):
    def post(self, request, format=None):
        if request.user.is_authenticated:
            return Response({"Invalid": "Already signed in."},
                            status=status.HTTP_406_NOT_ACCEPTABLE)

        if 'email' not in request.data\
                or 'username' not in request.data\
                or 'password' not in request.data:
            return Response({'Bad request': 'Invalid data'},
                            status=status.HTTP_400_BAD_REQUEST)

        email = request.data.get('email')
        password = request.data.get('password')
        username = request.data.get('username')

        try:
            User.objects.create(email=email, password=password,
                                username=username)

            user = authenticate(password=password, username=username)

            if not user:
                print('Something went wrong.')

            login(request, user)
        except BaseException:
            return Response({}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({}, status=status.HTTP_201_CREATED)


class LogoutUser(APIView):
    def post(self, request, format=None):
        user_matches = User.objects.filter(username=request.user.username)
        if user_matches.exists():
            user_matches[0].duel_code = ""
            user_matches[0].save(update_fields=['duel_code'])
        logout(request)
        return Response({}, status=status.HTTP_200_OK)


class LoginUser(APIView):
    def post(self, request, format=None):
        if request.user.is_authenticated:
            return Response({}, status=status.HTTP_200_OK)

        if 'username' not in request.data\
                or 'password' not in request.data:
            return Response({'Bad request': 'Invalid data'},
                            status=status.HTTP_400_BAD_REQUEST)
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)
        if user:
            login(request, user)
            return Response({}, status=status.HTTP_200_OK)
        else:
            return Response({"Unauthorized: Invalid Username or Password"},
                            status=status.HTTP_401_UNAUTHORIZED)


class GetBackingTrack(APIView):
    def post(self, request, format=None):

        if not request.user.is_authenticated:
            return Response({'Unauthorized': 'User not logged in.'},
                            status=status.HTTP_401_UNAUTHORIZED)

        user_matches = User.objects.filter(username=request.user.username)
        if not user_matches.exists():
            return Response({'Unauthorized': 'No such user.'},
                            status=status.HTTP_401_UNAUTHORIZED)
        user = user_matches[0]

        if not user.duel_code:
            return Response(
                {'Not joined': 'Cannot generate track outside duel.'},
                status=status.HTTP_401_UNAUTHORIZED)

        duel_matches = Duel.objects.filter(code=user.duel_code)
        if not duel_matches.exists():
            return Response(
                {'Not joined': 'Cannot generate track outside duel.'},
                status=status.HTTP_401_UNAUTHORIZED)

        duel = duel_matches[0]
        if user not in [duel.player_1, duel.player_2]:
            return Response(
                {'Spectating': 'Cannot generate track outside duel.'},
                status=status.HTTP_401_UNAUTHORIZED)

        print('Generating...')
        seq = music.generate.generate_random(
            genre=duel.genre.magneta_model,
            duration=duel.track_duration)
        print('Done!')

        output_path = Path(MEDIA_ROOT) / 'background'
        name = duel.code + datetime.datetime.now().strftime('%Y%m%d-%H%M%S')
        if user == duel.player_1:
            name += '_1'
        else:
            name += '_2'

        output_path = output_path / f'{name}.mid'
        music.utils.export_NoteSequence(seq=seq, output_file=str(output_path))

        mp3_path = Path(MEDIA_ROOT) / 'background'/ f'{name}.wav'

        music.utils.convert_midi_to_mp3(str(output_path), str(mp3_path))
        return Response({"name": name},
                        status=status.HTTP_200_OK)


class SubmitDuel(APIView):

    def post(self, request, format=None):
        if not request.user.is_authenticated:
            return Response({'Unauthorized': 'User not logged in.'},
                            status=status.HTTP_401_UNAUTHORIZED)

        user_matches = User.objects.filter(username=request.user.username)
        if not user_matches.exists():
            return Response({'Unauthorized': 'No such user.'},
                            status=status.HTTP_401_UNAUTHORIZED)
        user = user_matches[0]

        if not user.duel_code:
            return Response(
                {'Not joined': 'Cannot submit track outside duel.'},
                status=status.HTTP_401_UNAUTHORIZED)

        duel_matches = Duel.objects.filter(code=user.duel_code)
        if not duel_matches.exists():
            return Response(
                {'Not joined': 'Cannot submit track outside duel.'},
                status=status.HTTP_401_UNAUTHORIZED)

        duel = duel_matches[0]
        if user not in [duel.player_1, duel.player_2]:
            return Response(
                {'Spectating': 'Cannot submit track outside duel.'},
                status=status.HTTP_401_UNAUTHORIZED)
        

        if 'audio_file' not in request.FILES:
            return Response( {'Bad request': 'No audio_file in data'},
                            status=status.HTTP_400_BAD_REQUEST)

        if 'code' not in request.data:
            return Response( {'Bad request': 'No code in data'},
                            status=status.HTTP_400_BAD_REQUEST)

        f = request.FILES.get('audio_file')
        code = request.data.get('code')
        default_storage.save(f'./recordings/{code}.wav', ContentFile(f.read()))

        music.utils.overlay_mp3_wav(MEDIA_ROOT + f'/background/{code}.wav', 
                                    MEDIA_ROOT + f'/recordings/{code}.wav', 
                                    MEDIA_ROOT + f'/tracks/{code}.wav')

        tracks = TrackCodes.objects.filter(duel=duel)
        if not tracks.exists():
            return Response({"Conflict": "Track for duel doesn't exist."},
                            status=status.HTTP_409_CONFLICT)

        if user == duel.player_1:
            tracks[0].code1 = code
            tracks[0].save(update_fields=['code1'])
        else:
            tracks[0].code2 = code
            tracks[0].save(update_fields=['code2'])

    
        return Response({}, status.HTTP_200_OK)



class GetLeaderboard(generics.ListAPIView):
    queryset = User.objects.order_by('-user_score')
    serializer_class = LeaderSerializer


class GetVotes(APIView):

    def get(self, request, format=None):
        if not request.user.is_authenticated:
            return Response({'Unauthorized': 'User not logged in.'},
                            status=status.HTTP_401_UNAUTHORIZED)

        user_matches = User.objects.filter(username=request.user.username)
        if not user_matches.exists():
            return Response({'Unauthorized': 'No such user.'},
                            status=status.HTTP_401_UNAUTHORIZED)
        user = user_matches[0]

        duel_code = user.duel_code

        duel_matches = Duel.objects.filter(code=duel_code)
        if not duel_matches.exists():
            return Response({'Not found': 'No such duel.'},
                            status=status.HTTP_404_NOT_FOUND)
        duel = duel_matches[0]

        votes1 = len(Vote.objects.filter(player=1, duel=duel))
        votes2 = len(Vote.objects.filter(player=2, duel=duel))

        return Response({"votes1":votes1, "votes2":votes2},
                        status=status.HTTP_200_OK)

class GetLinks(APIView):
    def get(self, request, format=None):
        if not request.user.is_authenticated:
            return Response({'Unauthorized': 'User not logged in.'},
                            status=status.HTTP_401_UNAUTHORIZED)

        user_matches = User.objects.filter(username=request.user.username)
        if not user_matches.exists():
            return Response({'Unauthorized': 'No such user.'},
                            status=status.HTTP_401_UNAUTHORIZED)
        user = user_matches[0]

        duel_code = user.duel_code

        duel_matches = Duel.objects.filter(code=duel_code)
        if not duel_matches.exists():
            return Response({'Not found': 'No such duel.'},
                            status=status.HTTP_404_NOT_FOUND)
        duel = duel_matches[0]

        tracks = TrackCodes.objects.filter(duel=duel)
        if not tracks.exists():
            return Response({"Conflict": "Track for duel doesn't exist."},
                            status=status.HTTP_409_CONFLICT)

        return Response({
            'name1': tracks[0].code1,
            'name2': tracks[0].code2,
        }, status=status.HTTP_200_OK)


