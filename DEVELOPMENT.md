# 🛠️ Development Guide

This guide explains how to add new terminal commands and understand the project architecture.

## Quick Start: Adding a New Command

To add a new terminal command, follow these 5 steps:

1. **Register the command** in `components/terminal/commands/registry/commandRegistry.ts`
2. **Create a handler function** in the appropriate handler file
3. **Create output components** (if needed) in the appropriate outputs file
4. **Wire up the handler** in `components/terminal/hooks/useCommandLogic.tsx`
5. **Export the handler** in `components/terminal/commands/handlers/index.ts` (if creating a new handler file)

## Detailed Steps

### Step 1: Register the Command

Add your command to the `COMMANDS` array in `components/terminal/commands/registry/commandRegistry.ts`:

```typescript
{ 
  name: 'mycommand', 
  description: 'Does something cool', 
  category: 'fun',  // or 'file', 'system', 'info', 'network', 'terminal'
  aliases: ['mc', 'mycmd']  // optional
}
```

**Categories:**
- `file` - File system operations (ls, cd, cat, etc.)
- `system` - System information (sysinfo, neofetch, ps, etc.)
- `info` - User/profile information (whoami, skills, resume)
- `network` - Network operations (ping)
- `terminal` - Terminal control (clear, exit, history)
- `fun` - Entertainment/easter eggs (matrix, joke, game, etc.)

### Step 2: Create a Handler Function

Command handlers are functions that take `(args: string[], newLines: TerminalLine[])` and return `'exit' | 'clear' | void`.

#### Simple Command (No Output Component Needed)

For commands that output simple text, add the handler directly:

```typescript
// In appropriate handler file (e.g., simpleFunHandlers.tsx)
mycommand: (args: string[], newLines: TerminalLine[]) => {
    newLines.push({ 
        type: 'output', 
        content: <span>Hello from mycommand!</span> 
    });
}
```

#### Complex Command (With Output Component)

For commands with complex UI, create a separate output component:

```typescript
// In appropriate handler file
mycommand: (args: string[], newLines: TerminalLine[]) => {
    newLines.push({ 
        type: 'output', 
        content: <MyCommandOutput args={args} /> 
    });
}
```

Then create the output component in the appropriate outputs file:

```typescript
// In appropriate outputs file (e.g., simpleFunOutputs.tsx)
export const MyCommandOutput: React.FC<{ args: string[] }> = ({ args }) => {
    return (
        <div className="text-green-400">
            My command output with args: {args.join(' ')}
        </div>
    );
};
```

### Step 3: Handler Contexts

Handlers are created using factory functions that receive a "context" object. This allows handlers to access shared state and functions.

**Available Contexts:**

- `FileHandlersContext` - File system operations
  - `currentPath`, `setCurrentPath`, `fileSystem`, `getNodeAt`, `resolvePath`

- `SystemHandlersContext` - System operations
  - `trackEvent`, `stats` (achievement tracking)

- `InfoHandlersContext` - User information
  - `trackEvent`, `stats`

- `TerminalHandlersContext` - Terminal control
  - `setLines`, `setInput`, `setCursorPos`, `onClose`, `scrollToBottom`

- `SimpleFunHandlersContext` - Simple fun commands
  - `trackEvent`

- `Game/Animation Handlers` - Special contexts for games/animations
  - `setActiveComponent`, `scrollToBottom`, `trackEvent`, etc.

**Example with Context:**

```typescript
export interface MyHandlersContext {
    trackEvent: (key: string, value?: any) => void;
}

export const createMyHandlers = (context: MyHandlersContext) => {
    const { trackEvent } = context;
    
    return {
        mycommand: (args: string[], newLines: TerminalLine[]) => {
            trackEvent('mycommand_used', true);
            newLines.push({ 
                type: 'output', 
                content: <span>Command executed!</span> 
            });
        }
    };
};
```

### Step 4: Wire Up the Handler

In `components/terminal/hooks/useCommandLogic.tsx`, add your handler creator to the imports and create the handlers:

```typescript
// Add import
import { createMyHandlers } from '../commands/handlers';

// Inside useCommandLogic hook, create handlers
const myHandlers = createMyHandlers({ trackEvent });

// Add to the combined handlers object
const handlers: Record<string, CommandHandler> = {
    ...fileHandlers,
    ...systemHandlers,
    // ... other handlers
    ...myHandlers,  // Add your handlers here
};
```

### Step 5: Export Handler (If Creating New File)

If you created a new handler file, export it in `components/terminal/commands/handlers/index.ts`:

```typescript
export { createMyHandlers } from './myHandlers';
export type { MyHandlersContext } from './myHandlers';
```

**Note:** Use `export type` for interfaces/types to comply with `isolatedModules` TypeScript setting.

## Project Architecture

### Terminal System Structure

```
components/terminal/
├── commands/
│   ├── registry/
│   │   ├── commandRegistry.ts    # Central command definitions
│   │   └── commandTypes.ts        # Command type definitions
│   ├── handlers/                  # Command handler logic
│   │   ├── fileHandlers.tsx       # File system commands
│   │   ├── systemHandlers.tsx     # System commands
│   │   ├── infoHandlers.tsx       # Info commands
│   │   ├── networkHandlers.tsx   # Network commands
│   │   ├── terminalHandlers.tsx   # Terminal control
│   │   ├── fun/                   # Fun commands
│   │   │   ├── simpleFunHandlers.tsx
│   │   │   ├── games/             # Game handlers
│   │   │   ├── animations/        # Animation handlers
│   │   │   ├── gitHandlers.tsx
│   │   │   ├── systemFunHandlers.tsx
│   │   │   └── easterEggHandlers.tsx
│   │   ├── devModeHandler.tsx     # Developer mode
│   │   └── index.ts               # Handler exports
│   └── outputs/                   # Output components
│       ├── fileOutputs.tsx
│       ├── systemOutputs.tsx
│       ├── infoOutputs.tsx
│       ├── networkOutputs.tsx
│       └── fun/                   # Fun command outputs
│           ├── simpleFunOutputs.tsx
│           ├── games/
│           ├── animations/
│           ├── gitOutputs.tsx
│           ├── systemFunOutputs.tsx
│           └── easterEggOutputs.tsx
├── hooks/
│   └── useCommandLogic.tsx        # Main command execution logic
├── ui/                            # Terminal UI components
└── TerminalTypes.ts               # Core type definitions
```

### Key Files Reference

**`commandRegistry.ts`**
- Central registry of all commands
- Defines command names, descriptions, categories, and aliases
- Used for help command and tab completion

**`useCommandLogic.tsx`**
- Main hook that orchestrates command execution
- Manages command history, tab completion, file system traversal
- Combines all handler creators and routes commands to appropriate handlers

**`TerminalTypes.ts`**
- Core type definitions: `TerminalLine`, `FSNode`, `CommandHandler`
- `CommandHandler` type: `(args: string[], newLines: TerminalLine[]) => 'exit' | 'clear' | void`

**Handler Files**
- Factory functions that create handler objects
- Each handler file exports a `create*Handlers` function
- Handlers receive context objects for accessing shared state

**Output Files**
- React components that render command output
- Can be simple JSX or complex interactive components
- Used by handlers to display results

## Command Handler Types

### Simple Text Output

```typescript
mycommand: (args: string[], newLines: TerminalLine[]) => {
    newLines.push({ 
        type: 'output', 
        content: <span className="text-green-400">Simple output</span> 
    });
}
```

### Interactive Component

```typescript
mycommand: (args: string[], newLines: TerminalLine[]) => {
    newLines.push({ 
        type: 'output', 
        content: <MyInteractiveComponent onExit={() => {}} /> 
    });
}
```

### Command That Modifies State

```typescript
mycommand: (args: string[], newLines: TerminalLine[]) => {
    setCurrentPath(['~', 'new', 'path']);
    newLines.push({ 
        type: 'output', 
        content: <span>Changed directory</span> 
    });
}
```

### Command That Returns Special Values

```typescript
mycommand: (args: string[], newLines: TerminalLine[]) => {
    return 'clear';  // Clears terminal
    // or
    return 'exit';   // Exits terminal
}
```

## Testing Commands

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Open the terminal** in the browser

3. **Test your command:**
   ```bash
   mycommand
   mycommand arg1 arg2
   ```

4. **Test tab completion:**
   - Type partial command name and press Tab
   - Should autocomplete if registered correctly

5. **Test help:**
   ```bash
   help
   ```
   - Your command should appear in the help list

## Best Practices

1. **Use appropriate categories** - Group commands logically
2. **Create output components** - For complex UI, separate output from handler logic
3. **Track achievements** - Use `trackEvent` for user interactions
4. **Handle errors gracefully** - Show user-friendly error messages
5. **Support aliases** - Add common aliases for better UX
6. **Follow naming conventions** - Use lowercase, descriptive names
7. **Document complex logic** - Add comments for non-obvious behavior
8. **Reuse existing patterns** - Look at similar commands for examples

## Examples

### Example 1: Simple Command

**Register:**
```typescript
{ name: 'hello', description: 'Say hello', category: 'fun' }
```

**Handler:**
```typescript
hello: (args: string[], newLines: TerminalLine[]) => {
    const name = args[0] || 'World';
    newLines.push({ 
        type: 'output', 
        content: <span className="text-green-400">Hello, {name}!</span> 
    });
}
```

### Example 2: Command with Output Component

**Register:**
```typescript
{ name: 'clock', description: 'Show current time', category: 'system' }
```

**Handler:**
```typescript
clock: (args: string[], newLines: TerminalLine[]) => {
    newLines.push({ 
        type: 'output', 
        content: <ClockOutput /> 
    });
}
```

**Output Component:**
```typescript
export const ClockOutput: React.FC = () => {
    const [time, setTime] = useState(new Date());
    
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);
    
    return <div className="text-cyan-400">{time.toLocaleTimeString()}</div>;
};
```

### Example 3: Command with Context

**Handler File:**
```typescript
export interface MyHandlersContext {
    trackEvent: (key: string, value?: any) => void;
}

export const createMyHandlers = (context: MyHandlersContext) => {
    const { trackEvent } = context;
    
    return {
        stats: (args: string[], newLines: TerminalLine[]) => {
            trackEvent('stats_viewed', true);
            newLines.push({ 
                type: 'output', 
                content: <StatsOutput /> 
            });
        }
    };
};
```

**Wire Up:**
```typescript
const myHandlers = createMyHandlers({ trackEvent });
const handlers = { ...otherHandlers, ...myHandlers };
```

## Troubleshooting

**Command not found:**
- Check command is registered in `commandRegistry.ts`
- Verify handler is added to `handlers` object in `useCommandLogic.tsx`

**Tab completion not working:**
- Ensure command name is in `COMMANDS` array
- Check `getAllCommandNames()` includes your command

**TypeScript errors:**
- Use `export type` for interfaces/types in `index.ts`
- Ensure handler signature matches `CommandHandler` type

**Handler not executing:**
- Check handler is exported from `handlers/index.ts`
- Verify handler creator is called in `useCommandLogic.tsx`
- Ensure handler key matches command name exactly

---

**Need help?** Check existing commands for examples, or refer to the codebase structure above.

