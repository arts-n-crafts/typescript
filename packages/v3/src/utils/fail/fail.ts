export function fail(anExpression: Error) {
  return () => {
    throw anExpression
  }
}
