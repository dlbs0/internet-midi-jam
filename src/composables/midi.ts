import { useStorage, watchTriggerable } from "@vueuse/core";
import { sendToPeer } from "./peer";
import { Ref, ref } from "vue";
import {
  ControlChangeMessageEvent,
  Note,
  NoteMessageEvent,
  MessageEvent,
  Output,
  WebMidi,
} from "webmidi";
import { gmTones } from "./classes";

export const midiInputs: Ref<string[]> = ref([]);
export const midiOutputs: Ref<string[]> = ref([]);
export const selectedMidiInput = useStorage("selectMidiInput", "");
export const selectedMidiOutput = useStorage("selectedMidiOutput", "");
export const selectedMidiProgram = ref(gmTones[0]);
const peerMidiChannel = 2;

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
  sendMidiProgram();
}

let midiOutput: Output | null = null; // global MIDIOutput object

const { trigger: connectMidiOutput } = watchTriggerable(
  selectedMidiOutput,
  () => {
    const sMidiOuput = WebMidi.getOutputByName(selectedMidiOutput.value);
    midiOutput = sMidiOuput;
  }
);
const { trigger: connectMidiInput } = watchTriggerable(
  selectedMidiInput,
  (curr, prev) => {
    if (prev) {
      const oldInput = WebMidi.getInputByName(prev);
      oldInput?.removeListener();
    }
    const sMidiInput = WebMidi.getInputByName(curr);
    sMidiInput?.addListener("noteon", onMIDIInputMessage);
    sMidiInput?.addListener("noteoff", onMIDIInputMessage);
    sMidiInput?.addListener("controlchange", onMIDIInputCCMessage);
    sMidiInput?.addListener("programchange", onMIDIInputProgramChangeMessage);
  }
);
const { trigger: sendMidiProgram } = watchTriggerable(
  selectedMidiProgram,
  () => {
    const pNum = gmTones.indexOf(selectedMidiProgram.value);
    setMidiProgram({
      type: "programchange",
      channel: 1,
      program: pNum,
    });
    sendToPeer({
      type: "programchange",
      channel: peerMidiChannel,
      program: pNum,
    });
  }
);

export function sendToMidiOutput(data: PeerMidiEvent) {
  if (!midiOutput || !data.channel) return;
  console.log("sending midi output", data);

  // noteon
  if (
    data.type == "noteon" &&
    "note" in data &&
    typeof data.note != "undefined"
  ) {
    const note = new Note(data.note, { rawAttack: data.rawAttack });
    midiOutput.channels[data.channel].playNote(note);
  }
  // note off
  else if (
    data.type == "noteoff" &&
    "note" in data &&
    typeof data.note != "undefined"
  ) {
    const note = new Note(data.note, { rawAttack: data.rawAttack });
    midiOutput.channels[data.channel].stopNote(note);
  }
  // cc
  else if (
    data.type == "controlchange" &&
    "controller" in data &&
    typeof data.controller != "undefined" &&
    typeof data.controllerValue != "undefined"
  ) {
    midiOutput.channels[data.channel].sendControlChange(
      data.controller,
      data.controllerValue
    );
  }
}

function onMIDIInputMessage(inputevent: NoteMessageEvent) {
  console.log(`MIDI message received `, inputevent);
  sendToPeer({
    channel: peerMidiChannel,
    note: inputevent.note.number,
    rawAttack: inputevent.note.rawAttack,
    type: inputevent.type,
  });
}
function onMIDIInputCCMessage(inputevent: ControlChangeMessageEvent) {
  console.log(`MIDI message received `, inputevent);
  sendToPeer({
    type: inputevent.type,
    channel: peerMidiChannel,
    controller: inputevent.controller.number,
    controllerValue: inputevent.rawValue,
  });
}
function onMIDIInputProgramChangeMessage(inputevent: MessageEvent) {
  console.log(`MIDI message received `, inputevent);
  const pName = gmTones[inputevent.rawValue ?? 0];
  selectedMidiProgram.value = pName;
  sendToPeer({
    type: inputevent.type,
    channel: peerMidiChannel,
    program: inputevent.rawValue,
  });
}

export type PeerMidiEvent =
  | PeerMidiNoteEvent
  | PeerMidiCCEvent
  | PeerMidiProgramChangeEvent;
export interface BasePeerMidiEvent {
  channel: number;
  type: string;
}
export interface PeerMidiNoteEvent extends BasePeerMidiEvent {
  note?: number;
  rawAttack?: number;
}
export interface PeerMidiCCEvent extends BasePeerMidiEvent {
  controller?: number;
  controllerValue?: number;
}
export interface PeerMidiProgramChangeEvent extends BasePeerMidiEvent {
  program?: number;
}

export function setMidiProgram(data: PeerMidiProgramChangeEvent) {
  midiOutput?.channels[data.channel].sendProgramChange(data.program);
}
