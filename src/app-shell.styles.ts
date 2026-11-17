import { css } from "lit";

export const appShellStyles = css`
  :host {
    display: block;
    block-size: 100%;
    min-block-size: 0;
    background: var(--md-sys-color-surface);
    color: var(--md-sys-color-on-surface);
    font: var(--md-sys-typescale-body-medium-font);
  }
  .shell {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto minmax(0, 1fr) auto;
    block-size: 100%;
    min-block-size: 0;
    overflow: hidden;
  }
  .shell:has(.bottom) {
    grid-template-rows: auto minmax(0, 1fr) auto auto;
  }
  .bar {
    position: sticky;
    inset-block-start: 0;
    z-index: 5;
  }
  .body {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    min-block-size: 0;
    overflow: hidden;
  }
  :host([data-form="expanded"]) .body:has(.supporting),
  :host([data-form="medium"]) .body:has(.supporting) {
    grid-template-columns: auto minmax(0, 1fr) minmax(280px, 340px);
  }
  :host([data-form="expanded"]) .body:has(.navigation),
  :host([data-form="medium"]) .body:has(.navigation) {
    grid-template-columns: auto minmax(0, 1fr);
  }
  :host([data-form="expanded"]) .body:has(.navigation):has(.supporting),
  :host([data-form="medium"]) .body:has(.navigation):has(.supporting) {
    grid-template-columns: auto minmax(0, 1fr) minmax(280px, 340px);
  }
  .navigation {
    min-inline-size: 0;
    min-block-size: 0;
    overflow: hidden;
  }
  .navigation ::slotted(*) {
    block-size: 100%;
    max-block-size: 100%;
  }
  .content {
    min-inline-size: 0;
    min-block-size: 0;
    overflow: auto;
  }
  .supporting {
    display: flex;
    flex-direction: column;
    min-block-size: 0;
    border-inline-start: 1px solid var(--md-sys-color-outline-variant);
    background: var(--md-sys-color-surface-container-low);
    outline: none;
  }
  .supporting-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 16px 12px 8px 20px;
  }
  .supporting-title {
    font: var(--md-sys-typescale-title-medium-font);
    color: var(--md-sys-color-on-surface);
  }
  .supporting-body {
    flex: 1;
    min-block-size: 0;
    overflow: auto;
    padding: 4px 20px 24px;
  }
  .status {
    min-block-size: 32px;
    border-block-start: 1px solid var(--md-sys-color-outline-variant);
    background: var(--md-sys-color-surface-container-low);
    color: var(--md-sys-color-on-surface-variant);
    font: var(--md-sys-typescale-label-small-font);
  }
  .status ::slotted(*) {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 20px;
    min-block-size: 32px;
    box-sizing: border-box;
  }
  .bottom {
    position: sticky;
    inset-block-end: 0;
    z-index: 4;
    min-inline-size: 0;
    max-inline-size: 100%;
    overflow-x: auto;
  }
`;
