# @vapurrmaid/useEventListener

Simple hooks for adding and disposing event listeners in functional React
components.

## Rationale

- Reduce boilerplate code
- Don't worry about defining handlers with knowledge of event types

### :x: Without

```tsx
useEffect(() => {
  // Have to know to use special event type
  const someHandler = (e: BeforeUnloadEvent) => {
    // handle logic
  }
  window.addEventListener("beforeunload", someHandler)
  return () => window.removeEventListener("beforeunload", someHandler)
})
```

### :heavy_check_mark: With

```tsx
useWindowEventListener("beforeunload", (e) => {
  // proper type is applied!
  e.returnType = ''
})
```

## API

### useDocumentEventListener

```ts
useDocumentEventListener(type, listener, dependencies)
```

- type: `DocumentEventMap`
- listener: `(ev: DocumentEventMap[T]) => void`
- dependencies: `React.DependencyList = []`

### useWindowEventListener

```ts
useWindowEventListener(type, listener, dependencies)
```

- type: `WindowEventMap`
- listener: `(ev: WindowEventMap[T]) => void`
- dependencies: `React.DependencyList = []`
