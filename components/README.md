# Components Folder

This folder contains reusable UI components organized by feature.

## Structure

```
components/
├── health/              # Health screen components
│   ├── Dropdown.tsx     # Custom dropdown selector
│   ├── DatePicker.tsx   # Date of birth picker
│   ├── constants.ts     # Health-related constants (options)
│   ├── utils.ts         # Helper functions for health data
│   └── index.ts         # Barrel export
│
├── predictions/         # Predictions screen components
│   ├── PredictionCard.tsx  # Expandable prediction card
│   ├── types.ts           # TypeScript interfaces
│   ├── utils.ts           # Helper functions for formatting
│   └── index.ts           # Barrel export
│
└── folder-keeper.tsx    # Keeps folder in git
```

## Usage

### Health Components

```typescript
import { 
  Dropdown, 
  DatePicker, 
  cpOptions, 
  exangOptions, 
  sexOptions,
  convertGMTToYYYYMMDD,
  validateAge
} from '@/components/health';
```

### Predictions Components

```typescript
import { 
  PredictionCard, 
  PredictionData 
} from '@/components/predictions';
```

## Benefits

- **Separation of Concerns**: UI components are separated from business logic
- **Reusability**: Components can be reused across different screens
- **Maintainability**: Easier to find and update specific components
- **Readability**: Main screen files are cleaner and easier to understand
- **Testability**: Components can be tested in isolation

## Adding New Components

1. Create a new folder for the feature (e.g., `settings/`)
2. Add component files (`.tsx`)
3. Add types/interfaces (`.ts`)
4. Add utility functions (`.ts`)
5. Create an `index.ts` for barrel exports
6. Import in your screen using `@/components/feature-name`
