"""This module provides methods to generate a polyphonic sequence of a desired genre.

It uses magenta's polyphony_rnn model. To add a genre, please add a .mag file
corresponding to an RNN trained using that genre to the music_gen/models/.py

See the __main__ section at the bottom for an example of usage.
"""

from typing import List
from magenta.models.shared import sequence_generator_bundle
from magenta.models.polyphony_rnn import polyphony_sequence_generator
import note_seq
from note_seq.protobuf import generator_pb2
from note_seq.protobuf import music_pb2


models = {} # A dictionary containing the loaded models.

def load_init_models(genres: List[str]) -> None:
    """Loads RNNs for the specified genres. This will throw an exception if
    any genre does not have a .mag file.

    Args:
        genres: A list of genre names.

    Raises:
        ValueError: If any genre does not have a model as a .mag file in models/.
    """
    for genre in genres:
        try:
            # Find the bundle file, if it exists.
            bundle = sequence_generator_bundle.read_bundle_file(f'models/{genre}.mag')
        except FileNotFoundError:
            raise ValueError(f'{genre}.mag does not exist.')
        else:
            # Create the polyphony_rnn object for this genre.
            generator_map = polyphony_sequence_generator.get_generator_map()
            models[genre] = generator_map['polyphony'](checkpoint = None, bundle = bundle)
            models[genre].initialize()


def generate_from_primer(primer: music_pb2.NoteSequence, genre: str, duration: float, 
                         temperature: float = 1.0) -> music_pb2.NoteSequence:
    """Generates a polyphonic sequence of the desired genre and length using a
    primer.

    Uses one of the polyphony_rnn models to generate a note sequence. The
    primer is included as part of the sequence. Apart from varying the genre
    and length, changing the temperature can generate more varied sequences.

    Args:
        primer: A sequence of notes which needs continuation.
        genre: The name of the genre. The genre is loaded if it has not been
          already, provided the genre.mag file exists.
        duration: The required duration for the note sequence, in seconds.
        temperature: A measure of randomness of the produced sequence.
          Increasing this will make the resulting sequence less like the primer.

    Returns:
        A note sequence of the desired length and genre, produced using the
        primer.
    """

    # Load the model if not already loaded.
    if genre not in models:
        load_init_models([genre])

    # Set options for generation.
    end_time = max(n.end_time for n in primer.notes) if primer.notes else 0
    qpm = primer.tempos[0].qpm
    seconds_per_step = 60.0 / qpm / models[genre].steps_per_quarter

    generator_options = generator_pb2.GeneratorOptions()
    generator_options.args['temperature'].float_value = temperature;
    generator_options.generate_sections.add(
        start_time = end_time + seconds_per_step,
        end_time = duration)

    # Return the generated sequence.
    return models[genre].generate(primer, generator_options)


# An example - generates sample.mid, containing a 1 minute long continuation of
# 'Twinkle, Twinkle, Little Star' in the style of Bach's Chordales.
if __name__ == '__main__': 
    twinkle_twinkle = music_pb2.NoteSequence()

    twinkle_twinkle.notes.add(pitch=60, start_time=0.0, end_time=0.5, velocity=80)
    twinkle_twinkle.notes.add(pitch=60, start_time=0.5, end_time=1.0, velocity=80)
    twinkle_twinkle.notes.add(pitch=67, start_time=1.0, end_time=1.5, velocity=80)
    twinkle_twinkle.notes.add(pitch=67, start_time=1.5, end_time=2.0, velocity=80)
    twinkle_twinkle.notes.add(pitch=69, start_time=2.0, end_time=2.5, velocity=80)
    twinkle_twinkle.notes.add(pitch=69, start_time=2.5, end_time=3.0, velocity=80)
    twinkle_twinkle.notes.add(pitch=67, start_time=3.0, end_time=4.0, velocity=80)
    twinkle_twinkle.notes.add(pitch=65, start_time=4.0, end_time=4.5, velocity=80)
    twinkle_twinkle.notes.add(pitch=65, start_time=4.5, end_time=5.0, velocity=80)
    twinkle_twinkle.notes.add(pitch=64, start_time=5.0, end_time=5.5, velocity=80)
    twinkle_twinkle.notes.add(pitch=64, start_time=5.5, end_time=6.0, velocity=80)
    twinkle_twinkle.notes.add(pitch=62, start_time=6.0, end_time=6.5, velocity=80)
    twinkle_twinkle.notes.add(pitch=62, start_time=6.5, end_time=7.0, velocity=80)
    twinkle_twinkle.notes.add(pitch=60, start_time=7.0, end_time=8.0, velocity=80) 
    twinkle_twinkle.total_time = 8
    twinkle_twinkle.tempos.add(qpm=60);

    generated = generate_from_primer(twinkle_twinkle, 'bach', 60, 0.7)
    note_seq.sequence_proto_to_midi_file(generated, 'sample.mid')
