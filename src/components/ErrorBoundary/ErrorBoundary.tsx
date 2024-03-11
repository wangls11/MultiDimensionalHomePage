import { useRouteError } from "react-router-dom"

export const ErrorBoundary = () => {
  const error = useRouteError()
  console.error("路由错误：", error)

  return <div>{JSON.stringify(error)}</div>
}
