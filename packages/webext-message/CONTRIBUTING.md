# Contributing to webext-message

Thank you for your interest in contributing! This guide will help you get started.

## 📋 Code of Conduct

- Be respectful and inclusive
- Focus on code, not personalities
- Help others learn and grow
- Report issues responsibly

## 🚀 Getting Started

### 1. Fork and Clone

```bash
git clone https://github.com/YOUR_USERNAME/webext-message.git
cd webext-message
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `test/` - Test additions
- `refactor/` - Code refactoring
- `perf/` - Performance improvements

## 💻 Development Workflow

### Run in Watch Mode

```bash
npm run dev
```

This runs both compilation and tests in watch mode.

### Build for Production

```bash
npm run build
```

### Run Tests

```bash
npm test           # Single run
npm run dev:test   # Watch mode
npm test -- --coverage  # With coverage report
```

### Type Check

```bash
npx tsc --noEmit
```

## 📝 Code Style

### TypeScript

- Use strict mode (`strict: true`)
- Add type annotations for public APIs
- Use generics for reusable functions
- Document complex logic with comments

```typescript
// ✅ Good
interface MessageRequest<T = any> {
  name: string
  body?: T
}

export const sendMessage = async <T, R>(
  request: MessageRequest<T>
): Promise<R> => {
  // Implementation
}

// ❌ Avoid
export const sendMessage = async (request) => {
  // No types
}
```

### Naming Conventions

- Functions: camelCase
- Classes: PascalCase
- Constants: UPPER_SNAKE_CASE
- Private members: prefix with `_`

```typescript
const CACHE_SIZE = 100
class MessageBus {}
const handleMessage = () => {}
const _privateHelper = () => {}
```

### Comments

```typescript
// ✅ Good - explains why, not what
// Deduplicate requests within 5s window to reduce API calls
const dedupeKey = `${name}:${timestamp}`

// ❌ Avoid - obvious from code
// Set x to 1
const x = 1
```

### Error Handling

```typescript
// ✅ Good - specific error handling
try {
  await operation()
} catch (error) {
  console.error('Operation failed:', error instanceof Error ? error.message : 'Unknown')
  throw error
}

// ❌ Avoid - silent failures
try {
  await operation()
} catch (e) {
  // Do nothing
}
```

## 📚 Testing

### Test Structure

```typescript
describe('Feature', () => {
  beforeEach(() => {
    // Setup
  })

  test('should handle expected case', () => {
    // Arrange
    const input = ...
    
    // Act
    const result = ...
    
    // Assert
    expect(result).toBe(...)
  })

  test('should handle error case', () => {
    // Test error scenarios
  })
})
```

### Coverage Requirements

- Aim for 80%+ coverage
- All public APIs should have tests
- Error paths must be tested
- Integration tests for complex flows

### Running Tests

```bash
npm test                    # Run all tests
npm test -- specific.test   # Run specific test
npm test -- --coverage      # With coverage
npm test -- --watch         # Watch mode
```

## 📖 Documentation

### JSDoc Comments

```typescript
/**
 * Send message to background service worker
 * 
 * @template TRequest - The request body type
 * @template TResponse - The response body type
 * @param request - Message request object
 * @param request.name - Message identifier
 * @param request.body - Message payload
 * @returns Promise resolving to response body
 * 
 * @example
 * const response = await sendToBackground({
 *   name: 'getData',
 *   body: { id: 123 }
 * })
 */
export const sendToBackground = async <TRequest, TResponse>(
  request: ExtMessaging.Request<TRequest>
): Promise<TResponse> => {
  // Implementation
}
```

### README Updates

When adding features, update:
1. **README.md** - Quick start and overview
2. **SETUP.md** - Detailed API documentation
3. **PATTERNS.md** - Usage patterns and examples
4. **CHANGELOG.md** - Version notes

## 🔄 Pull Request Process

### Before Submitting

1. ✅ Run all tests: `npm test`
2. ✅ Check types: `npx tsc --noEmit`
3. ✅ Build: `npm run build`
4. ✅ Update documentation if needed
5. ✅ Add/update tests for new code
6. ✅ Keep commits clean and logical

### PR Checklist

```markdown
- [ ] Tests pass locally
- [ ] Code follows style guide
- [ ] Documentation updated
- [ ] CHANGELOG updated
- [ ] No unnecessary dependencies added
- [ ] Backwards compatible (or documented breaking change)
- [ ] Types are correct and strict
```

### PR Title Format

```
type(scope): description

Examples:
- feat(types): add new message type
- fix(relay): handle timeout correctly
- docs(readme): update quick start
- perf(port): optimize pooling strategy
- refactor(tests): simplify mock setup
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Motivation
Why these changes were needed

## Changes
- Change 1
- Change 2

## Testing
How to test the changes

## Screenshots (if applicable)
Include visual changes

## Breaking Changes
List any breaking changes

## Checklist
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] CHANGELOG updated
```

## 🐛 Bug Reports

### Before Reporting

1. Check existing issues
2. Try latest version
3. Confirm in minimal reproduction
4. Test with examples

### Bug Report Template

```markdown
## Description
Clear description of the bug

## Steps to Reproduce
1. ...
2. ...
3. ...

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [Windows/macOS/Linux]
- Node: [version]
- npm: [version]
- webext-message: [version]
- Browser: [Chrome/Edge/etc]

## Minimal Reproduction
```typescript
// Code that reproduces the issue
```

## 💡 Feature Requests

### Feature Template

```markdown
## Description
What feature should be added?

## Motivation
Why is this needed?

## Proposed Solution
How should it work?

## Example Usage
```typescript
// How users would use it
```

## Alternatives
Other approaches considered?
```

## 🧹 Commit Guidelines

### Commit Message Format

```
type(scope): subject

body

footer
```

### Types

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Code style (formatting)
- `refactor` - Code refactoring
- `perf` - Performance improvement
- `test` - Test addition/modification
- `ci` - CI/CD configuration
- `chore` - Build, dependencies, etc

### Examples

```
feat(message): add timeout support for sends

Allow sendToBackground to timeout after specified duration.
Implements exponential backoff retry logic.

Fixes #123
```

```
fix(relay): prevent duplicate message processing

Add instanceId validation in relay handler to prevent
processing the same message twice.

Closes #456
```

## 📦 Adding Dependencies

### Guidelines

- Only add when necessary
- Prefer minimal dependencies
- Check bundle impact
- Update documentation
- Update CHANGELOG

### Process

1. Discuss in issue first
2. Check alternatives
3. Add with `npm install`
4. Update documentation
5. Update lock file
6. Include in PR

## 🚀 Release Process (Maintainers)

1. Update CHANGELOG
2. Update version in package.json
3. Create git tag
4. Run `npm run build`
5. Run `npm publish`

## 📞 Getting Help

- **Questions**: Open discussion
- **Bugs**: File issue with reproduction
- **Features**: Open discussion or issue
- **Code Review**: Ask in PR comments

## 🎓 Learning Resources

### Understanding the Codebase

1. Start with `src/index.ts` - Main exports
2. Read `src/types.ts` - Type definitions
3. Review `src/message.ts` - Core implementation
4. Check `src/*.test.ts` - Usage examples
5. Study `examples/wxt-demo/` - Real usage

### Key Concepts

- **Messages**: One-way communication
- **Ports**: Long-lived bidirectional communication
- **Relay**: Window.postMessage wrapper
- **Pub-Sub**: Multi-subscriber broadcast
- **Hooks**: React integration

### Testing Patterns

- Mock Chrome API
- Simulate MessageEvents
- Test error scenarios
- Verify cleanup

## ✨ Good First Issues

Looking to contribute? Start with:
- Documentation improvements
- Test coverage expansion
- Example creation
- Type definition refinement
- Performance optimization
- Bug fixes

## 🎉 Thank You!

Your contributions make webext-message better for everyone!

---

**Questions?** Open an issue or discussion.

**Want to contribute?** Start with the [SETUP.md](./SETUP.md) guide.

**Found a bug?** Report it with a minimal reproduction.

**Have an idea?** Open a feature request discussion.
