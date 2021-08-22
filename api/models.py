from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
import random
import string

class UserManager(BaseUserManager):
    def create_user(self, email, username, password=None):
        if not email:
            raise ValueError('Email required')
        if not username:
            raise ValueError('Username required')

        user = self.model(
            email=self.normalize_email(email),
            username=username,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password):
        user = self.create_user(
                email=self.normalize_email(email),
                username=username,
                password=password
            )
        user.is_admin = True
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)
 

class User(AbstractBaseUser):
    email = models.EmailField(max_length=60, unique=True)
    username = models.CharField(max_length=30, unique=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now=True)
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']
    objects = UserManager()

    user_score = models.PositiveIntegerField(default=0)
    duel_code = models.CharField(max_length=6, default="", null=True, blank=True)

    def has_perm(self, perm, obj=None):
        return self.is_admin

    def has_module_perms(self, app_label):
        return True

    # Quick fix, DO NOT USE IN PRODUCTION!
    def check_password(self, raw_password: str) -> bool:
        return self.password == raw_password

    def __str__(self):
        return self.username + ', ' + self.email


class Genre(models.Model):
    genre_name=models.CharField(max_length=50, unique=True)
    magneta_model=models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.genre_name


def generate_code():
    while True:
        code=''.join(random.choices(
            string.digits + string.ascii_uppercase, k=Duel.CODE_LENGTH))
        if len(Duel.objects.filter(code=code)) == 0:
            return code


class Duel(models.Model):
    CODE_LENGTH=6
    INVALID=-1
    JOINING=0
    RECORDING=1
    VOTING=2

    code=models.CharField(max_length=CODE_LENGTH,
                            default=generate_code, unique=True)
    player_1=models.ForeignKey(
        User,
        unique=True,
        on_delete=models.CASCADE,
        related_name="%(app_label)s_%(class)s_related",
        null=False)
    player_2=models.ForeignKey(
        User,
        unique=True,
        on_delete=models.CASCADE,
        default=None,
        null=True)
    status=models.IntegerField(default=JOINING)
    genre=models.ForeignKey(Genre, on_delete=models.RESTRICT)
    duration=models.PositiveIntegerField(default=15)
    track_duration=models.PositiveIntegerField(default=60)


class Vote(models.Model):
    duel=models.ForeignKey(Duel, on_delete=models.CASCADE)
    user=models.ForeignKey(User, on_delete=models.CASCADE)
    player=models.PositiveSmallIntegerField()


class TrackCodes(models.Model):
    duel = models.ForeignKey(Duel, on_delete=models.SET_NULL, null=True)
    code1 = models.CharField(max_length=50, unique=True, default="")
    code2 = models.CharField(max_length=50, unique=True, default="")
