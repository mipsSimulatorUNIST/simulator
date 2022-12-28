import { BYTES_PER_WORD } from "./constants.js";

// Temporary file stream pointers
export let dataSeg = [];
export let textSeg = [];

// Size of each section
export let dataSectionSize = 0;
export let textSectionSize = 0;

export const increaseDataSectionSize = () => {
    dataSectionSize += BYTES_PER_WORD;
}

export const increaseTextSectionSize = () => {
    textSectionSize += BYTES_PER_WORD;
}