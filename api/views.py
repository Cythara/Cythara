from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from django.contrib.auth import authenticate, login, logout
from api.serializers import DuelSerializer, GenreSerializer, VoteSerializer
from .models import Duel, Genre, User, Vote
import music.generate, music.utils
from cythara.settings import MEDIA_ROOT
import datetime

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
        if player_1.duel_code is not None:
            if Duel.objects.filter(code=player_1.duel_code).exists():
                return Response({'Invalid': 'User is already in a duel.'},
                                status=status.HTTP_409_CONFLICT)

        duel = Duel(player_1=player_1, genre=genre_matches[0])
        duel.save()

        player_1.duel_code = duel.code
        player_1.save(update_fields=['duel_code'])

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

        if 'duel' not in request.data or 'player' not in request.data:
            return Response({'Bad request': 'Invalid data'},
                            status=status.HTTP_400_BAD_REQUEST)
        duel_code = request.data.get('duel')
        player = request.data.get('player')

        duel_matches = Duel.objects.filter(code=duel_code)
        if not duel_matches.exists():
            return Response({'Not found': 'No such duel.'},
                            status=status.HTTP_404_NOT_FOUND)
        duel = duel_matches[0]

        if duel.status != Duel.VOTING:
            return Response({'Forbidden: ': 'Cannot vote now.'},
                            status=status.HTTP_403_FORBIDDEN)

        if user.duel_code != duel.code or user in [duel.player_1, duel.player_2]:
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
        except:
            return Response({}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({}, status=status.HTTP_201_CREATED)

        
class LogoutUser(APIView):
    def post(self, request, format=None):
        user_matches = User.objects.filter(username=request.user.username)
        if user_matches.exists():
            user_matches[0].duel_code = None
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
            return Response({'Not joined':'Cannot generate track outside duel.'}, 
                            status=status.HTTP_401_UNAUTHORIZED)

        duel_matches = Duel.objects.filter(code=user.duel_code)
        if not duel_matches.exists():
            return Response({'Not joined':'Cannot generate track outside duel.'}, 
                            status=status.HTTP_401_UNAUTHORIZED)

        duel = duel_matches[0]
        if user not in [duel.player_1, duel.player_2]:
            return Response({'Spectating':'Cannot generate track outside duel.'}, 
                            status=status.HTTP_401_UNAUTHORIZED)
        
        print('Generating...')
        seq = music.generate.generate_random(genre=duel.genre.magneta_model, duration=duel.track_duration)
        print('Done!')

        output_path = MEDIA_ROOT / 'background'
        name = duel.code + datetime.datetime.now().strftime('%Y%m%d-%H%M%S')
        if user == duel.player_1:
            name += '_1'
        else:
            name += '_2'

        output_path = output_path / f'{name}.mid'
        music.utils.export_NoteSequence(seq=seq,output_file=str(output_path))

    

        return Response({str(output_path)}, status=status.HTTP_200_OK)
