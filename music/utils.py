from note_seq.midi_io import note_sequence_to_midi_file
from note_seq.protobuf.music_pb2 import NoteSequence
from pydub import AudioSegment
from cythara.settings import BASE_DIR
import subprocess
import wave


def convert_midi_to_mp3(input_file: str, output_file: str):
    # Unsafe
    subprocess.run(["timidity {} -Ow -o {}".format(input_file, output_file)],
                   shell=True)


def overlay_mp3_wav(file_1: str, file_2: str,
                    output_file: str, volume_1: int = 0, volume_2: int = 0):
    sound_1 = AudioSegment.from_file(file_1, format="wav")
    sound_2 = AudioSegment.from_file(file_2, format="wav")

    overlay = sound_1.overlay(sound_2)

    overlay.export(output_file, format="wav")


def export_NoteSequence(seq: NoteSequence, output_file: str):
    note_sequence_to_midi_file(seq, output_file)


def models_path():
    return str(BASE_DIR / 'music/models/')
