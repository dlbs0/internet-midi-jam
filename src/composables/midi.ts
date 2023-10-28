import { useStorage, watchTriggerable } from "@vueuse/core";
import { sendToPeer } from "./peer";
import { Ref, ref } from "vue";
import {
  ControlChangeMessageEvent,
  Note,
  NoteMessageEvent,
  Output,
  WebMidi,
} from "webmidi";

export const midiInputs: Ref<string[]> = ref([]);
export const midiOutputs: Ref<string[]> = ref([]);
export const selectedMidiInput = useStorage("selectMidiInput", "");
export const selectedMidiOutput = useStorage("selectedMidiOutput", "");

export function startMidi() {
  WebMidi.enable()
    .then(onEnabled)
    .catch((err) => alert(err));
}

function onEnabled() {
  WebMidi.inputs.forEach((input) => midiInputs.value.push(input.name));
  WebMidi.outputs.forEach((output) => midiOutputs.value.push(output.name));
  connectMidiInput();
  connectMidiOutput();

  midiOutput?.channels[1].sendControlChange(64, 0);
}

let midiOutput: Output | null = null; // global MIDIOutput object

const { trigger: connectMidiOutput } = watchTriggerable(
  selectedMidiOutput,
  () => {
    const sMidiOuput = WebMidi.getOutputByName(selectedMidiOutput.value);
    midiOutput = sMidiOuput;
  }
);

export function sendToMidiOutput(data: PeerMidiEvent) {
  if (!midiOutput || !data.channel) return;
  console.log("sending midi output", data);

  if (data.type == "noteon" && typeof data.note != "undefined") {
    const note = new Note(data.note, { rawAttack: data.rawAttack });
    midiOutput.channels[data.channel].playNote(note);
  } else if (data.type == "noteoff" && typeof data.note != "undefined") {
    const note = new Note(data.note, { rawAttack: data.rawAttack });
    midiOutput.channels[data.channel].stopNote(note);
  } else if (
    data.type == "controlchange" &&
    typeof data.controller != "undefined" &&
    typeof data.controllerValue != "undefined"
  ) {
    console.log(data.controller, data.controllerValue);
    midiOutput.channels[data.channel].sendControlChange(
      data.controller,
      data.controllerValue
    );
  }
}

const { trigger: connectMidiInput } = watchTriggerable(
  selectedMidiInput,
  () => {
    const sMidiInput = WebMidi.getInputByName(selectedMidiInput.value);
    sMidiInput?.addListener("noteon", onMIDIInputMessage);
    sMidiInput?.addListener("noteoff", onMIDIInputMessage);
    sMidiInput?.addListener("controlchange", onMIDIInputCCMessage);
  }
);

function onMIDIInputMessage(inputevent: NoteMessageEvent) {
  console.log(`MIDI message received `, inputevent);
  sendToPeer("midi", {
    channel: 2,
    note: inputevent.note.number,
    rawAttack: inputevent.note.rawAttack,
    type: inputevent.type,
  });
}
function onMIDIInputCCMessage(inputevent: ControlChangeMessageEvent) {
  console.log(`MIDI message received `, inputevent);
  sendToPeer("midi", {
    channel: 2,
    controller: inputevent.controller.number,
    controllerValue: inputevent.rawValue,
    type: inputevent.type,
  });
}

export interface PeerMidiEvent {
  channel: number;
  note?: number;
  rawAttack?: number;
  controller?: number;
  controllerValue?: number;
  type: string;
}
