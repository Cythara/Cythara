from api.views import AddVoteDuel, CreateDuel, GetBackingTrack, GetDuel, GetLeaderboard, GetLinks, GetVotes, JoinDuel, ListDuels, ListGenres, LogoutUser, RegisterUser, LoginUser, SubmitDuel
from django.urls import path

urlpatterns = [
    # Duel management.
    path('create-duel', CreateDuel.as_view()),
    path('get-duel', GetDuel.as_view()),
    path('list-duels', ListDuels.as_view()),


    # Duel in-progress.
    path('join-duel', JoinDuel.as_view()),
    path('add-vote-duel', AddVoteDuel.as_view()),
    path('get-backing-track', GetBackingTrack.as_view()),
    path('submit-duel', SubmitDuel.as_view()),
    path('get-votes', GetVotes.as_view()),
    path('get-links', GetLinks.as_view()),

    # Sign in/out/up.
    path('register-user', RegisterUser.as_view()),
    path('logout-user', LogoutUser.as_view()),
    path('login-user', LoginUser.as_view()),

    # Other.
    path('list-genres', ListGenres.as_view()),
    path('leaderboard', GetLeaderboard.as_view()),
]

"""
    path('end-duel', EndDuel.as_view()),


    # Post-duel.
    path('tracks-duel', NotImplemented),
    path('results-duel', NotImplemented),

    # Other
    path('view-profile', NotImplemented),
    path('list-popular', NotImplemented),

"""
