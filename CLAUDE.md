# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

`pretext-3d` is a template for building editorial web pages where live 3D geometry actively shapes text layout. The 3D model's silhouette becomes a real layout constraint—text flows around the current silhouette in real time as the camera moves.

Core data flow:
`GLB -> Three.js camera -> black/white mask -> slot widths -> Pretext -> absolutely positioned lines`

## Commands

```bash
pnpm install      # Install dependencies
pnpm dev          # Start dev server at http://127.0.0.1:4173/
pnpm build        # Production build
pnpm check        # Run linter and tests (node --check + node --test)
```

## Architecture

### Pipeline

1. **Render**: Three.js renders the GLB model to screen
2. **Mask**: Same scene rendered to an offscreen canvas as high-contrast black/white
3. **Scan**: Each horizontal text band is scanned for occupied pixels
4. **Carve**: Remaining horizontal runs become legal text slots
5. **Layout**: Pretext computes the next valid line inside each slot
6. **Position**: Lines are absolutely positioned as DOM nodes

### Key Files

- **`main.mjs`**: Entry point handling scene setup, model loading, camera motion, region layout, and text placement orchestration. Key functions: `normalizeModel()`, `computeFitState()`, `getRegions()`, `updatePose()`, `renderMask()`, `layoutCopy()`
- **`mask-layout.mjs`**: Pure layout helpers (no Three.js dependency). Key functions: `getMaskIntervalForBand()`, `carveTextLineSlots()`, `chooseSlot()`, `mergeIntervals()`, `getScrubPose()`
- **`mask-layout.test.mjs`**: Unit tests for mask-layout.mjs functions

### Layout Quality Knobs

In `main.mjs`:
- `MASK_SIZE`: Increase if thin beams or narrow edges are missed (default 1024x576)
- `MASK_PADDING`: Increase if text gets too close to model edge (default 20)
- `MIN_SLOT_WIDTH`: Increase to filter noisy fragments (default 160)
- `MIN_JUSTIFY_WIDTH`: Increase to prevent aggressive word stretching in narrow slots (default 180)

### Model-Specific Tuning (in `main.mjs`)

- `SCRUB_RANGES`: Camera motion bounds (yaw, pitch, distance, pan)
- `normalizeModel()`: Scale and center the model after loading
- `computeFitState()`: Calculate camera distance for correct framing
- `getRegions()`: Text column positions/sizes (responsive breakpoints at 980px)

### Asset Management

- Place model at `assets/model.glb` — this path is git-ignored
- Swap model, refresh, then tune camera/layout parameters only if needed

## Stack

- **Three.js** (^0.166.1): 3D rendering
- **@chenglou/pretext** (^0.0.3): Text layout engine
- **Vite** (^5.4.8): Build tool and dev server
