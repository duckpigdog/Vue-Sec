import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const apiMockPlugin = () => ({
  name: 'api-mock-plugin',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url === '/api/user/info') {
        res.setHeader('Content-Type', 'application/json')
        res.end(
          JSON.stringify({
            status: 'unauthorized',
            role: 'user',
            username: 'guest',
          }),
        )
        return
      }
      next()
    })
  },
})

export default defineConfig({
  plugins: [vue(), apiMockPlugin()],
})

