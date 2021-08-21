from note_seq.midi_io import sequence_proto_to_midi_file
from note_seq.protobuf.music_pb2 import NoteSequence
from pydub import AudioSegment
from cythara.settings import BASE_DIR
import subprocess


def convert_midi_to_mp3(input_file: str, output_file: str):
    subprocess.run(["timidity {} - Ow - o {}".format(input_file, output_file)])


def overlay_mp3(file_1: str, file_2: str,
                output_file: str, volume_1: int = 0, volume_2: int = 0):
    sound_1 = AudioSegment.from_file(file_1, format="mp3") + volume_1
    sound_2 = AudioSegment.from_file(file_2, format="mp3") + volume_2

    overlay = sound_1.overlay(sound_2)

    overlay.export(output_file, format="mp3")


def export_NoteSequence(seq: NoteSequence, output_file):
    sequence_proto_to_midi_file(seq, output_file)


def models_path():
    return str(BASE_DIR / 'music/models/')
