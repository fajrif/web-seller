// vite.config.js
import { fileURLToPath } from "node:url";
import VueI18nPlugin from "file:///Users/fajryfachriansyah/icon/web-seller/node_modules/@intlify/unplugin-vue-i18n/lib/vite.mjs";
import vue from "file:///Users/fajryfachriansyah/icon/web-seller/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///Users/fajryfachriansyah/icon/web-seller/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import AutoImport from "file:///Users/fajryfachriansyah/icon/web-seller/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///Users/fajryfachriansyah/icon/web-seller/node_modules/unplugin-vue-components/dist/vite.js";
import { VueRouterAutoImports, getPascalCaseRouteName } from "file:///Users/fajryfachriansyah/icon/web-seller/node_modules/unplugin-vue-router/dist/index.mjs";
import VueRouter from "file:///Users/fajryfachriansyah/icon/web-seller/node_modules/unplugin-vue-router/dist/vite.mjs";
import { defineConfig } from "file:///Users/fajryfachriansyah/icon/web-seller/node_modules/vite/dist/node/index.js";
import VueDevTools from "file:///Users/fajryfachriansyah/icon/web-seller/node_modules/vite-plugin-vue-devtools/dist/vite.mjs";
import Layouts from "file:///Users/fajryfachriansyah/icon/web-seller/node_modules/vite-plugin-vue-layouts/dist/index.mjs";
import vuetify from "file:///Users/fajryfachriansyah/icon/web-seller/node_modules/vite-plugin-vuetify/dist/index.mjs";
import svgLoader from "file:///Users/fajryfachriansyah/icon/web-seller/node_modules/vite-svg-loader/index.js";
var __vite_injected_original_import_meta_url = "file:///Users/fajryfachriansyah/icon/web-seller/vite.config.js";
var vite_config_default = defineConfig({
  plugins: [
    // Docs: https://github.com/posva/unplugin-vue-router
    // ℹ️ This plugin should be placed before vue plugin
    VueRouter({
      getRouteName: (routeNode) => {
        return getPascalCaseRouteName(routeNode).replace(/([a-z\d])([A-Z])/g, "$1-$2").toLowerCase();
      }
      // beforeWriteFiles: root => {
      //   root.insert('/apps/email/:filter', '/src/pages/apps/email/index.vue')
      //   root.insert('/apps/email/:label', '/src/pages/apps/email/index.vue')
      // },
    }),
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag === "swiper-container" || tag === "swiper-slide"
        }
      }
    }),
    VueDevTools(),
    vueJsx(),
    // Docs: https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin
    vuetify({
      styles: {
        configFile: "src/assets/styles/variables/_vuetify.scss"
      }
    }),
    // Docs: https://github.com/johncampionjr/vite-plugin-vue-layouts#vite-plugin-vue-layouts
    Layouts({
      layoutsDirs: "./src/layouts/"
    }),
    // Docs: https://github.com/antfu/unplugin-vue-components#unplugin-vue-components
    Components({
      dirs: ["src/@core/components", "src/components"],
      dts: true,
      resolvers: [
        (componentName) => {
          if (componentName === "VueApexCharts")
            return { name: "default", from: "vue3-apexcharts", as: "VueApexCharts" };
        }
      ]
    }),
    // Docs: https://github.com/antfu/unplugin-auto-import#unplugin-auto-import
    AutoImport({
      imports: ["vue", VueRouterAutoImports, "@vueuse/core", "@vueuse/math", "vue-i18n", "pinia"],
      dirs: [
        "./src/@core/utils",
        "./src/@core/composable/",
        "./src/composables/",
        "./src/utils/",
        "./src/plugins/*/composables/*"
      ],
      vueTemplate: true,
      // ℹ️ Disabled to avoid confusion & accidental usage
      ignore: ["useCookies", "useStorage"],
      eslintrc: {
        enabled: true,
        filepath: "./.eslintrc-auto-import.json"
      }
    }),
    // Docs: https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n#intlifyunplugin-vue-i18n
    VueI18nPlugin({
      runtimeOnly: true,
      compositionOnly: true,
      include: [
        fileURLToPath(new URL("./src/plugins/i18n/locales/**", __vite_injected_original_import_meta_url))
      ]
    }),
    svgLoader()
  ],
  define: { "process.env": {} },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url)),
      "@themeConfig": fileURLToPath(new URL("./themeConfig.js", __vite_injected_original_import_meta_url)),
      "@core": fileURLToPath(new URL("./src/@core", __vite_injected_original_import_meta_url)),
      "@layouts": fileURLToPath(new URL("./src/@layouts", __vite_injected_original_import_meta_url)),
      "@images": fileURLToPath(new URL("./src/assets/images/", __vite_injected_original_import_meta_url)),
      "@styles": fileURLToPath(new URL("./src/assets/styles/", __vite_injected_original_import_meta_url)),
      "@configured-variables": fileURLToPath(new URL("./src/assets/styles/variables/_template.scss", __vite_injected_original_import_meta_url)),
      "@db": fileURLToPath(new URL("./src/plugins/fake-api/handlers/", __vite_injected_original_import_meta_url)),
      "@api-utils": fileURLToPath(new URL("./src/plugins/fake-api/utils/", __vite_injected_original_import_meta_url))
    }
  },
  build: {
    chunkSizeWarningLimit: 5e3
  },
  optimizeDeps: {
    exclude: ["vuetify"],
    entries: [
      "./src/**/*.vue"
    ]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZmFqcnlmYWNocmlhbnN5YWgvaWNvbi93ZWItc2VsbGVyXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvZmFqcnlmYWNocmlhbnN5YWgvaWNvbi93ZWItc2VsbGVyL3ZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9mYWpyeWZhY2hyaWFuc3lhaC9pY29uL3dlYi1zZWxsZXIvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBmaWxlVVJMVG9QYXRoIH0gZnJvbSAnbm9kZTp1cmwnXG5pbXBvcnQgVnVlSTE4blBsdWdpbiBmcm9tICdAaW50bGlmeS91bnBsdWdpbi12dWUtaTE4bi92aXRlJ1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5pbXBvcnQgdnVlSnN4IGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZS1qc3gnXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJ1xuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSdcbmltcG9ydCB7IFZ1ZVJvdXRlckF1dG9JbXBvcnRzLCBnZXRQYXNjYWxDYXNlUm91dGVOYW1lIH0gZnJvbSAndW5wbHVnaW4tdnVlLXJvdXRlcidcbmltcG9ydCBWdWVSb3V0ZXIgZnJvbSAndW5wbHVnaW4tdnVlLXJvdXRlci92aXRlJ1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCBWdWVEZXZUb29scyBmcm9tICd2aXRlLXBsdWdpbi12dWUtZGV2dG9vbHMnXG5pbXBvcnQgTGF5b3V0cyBmcm9tICd2aXRlLXBsdWdpbi12dWUtbGF5b3V0cydcbmltcG9ydCB2dWV0aWZ5IGZyb20gJ3ZpdGUtcGx1Z2luLXZ1ZXRpZnknXG5pbXBvcnQgc3ZnTG9hZGVyIGZyb20gJ3ZpdGUtc3ZnLWxvYWRlcidcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICAvLyBEb2NzOiBodHRwczovL2dpdGh1Yi5jb20vcG9zdmEvdW5wbHVnaW4tdnVlLXJvdXRlclxuICAgIC8vIFx1MjEzOVx1RkUwRiBUaGlzIHBsdWdpbiBzaG91bGQgYmUgcGxhY2VkIGJlZm9yZSB2dWUgcGx1Z2luXG4gICAgVnVlUm91dGVyKHtcbiAgICAgIGdldFJvdXRlTmFtZTogcm91dGVOb2RlID0+IHtcbiAgICAgICAgLy8gQ29udmVydCBwYXNjYWwgY2FzZSB0byBrZWJhYiBjYXNlXG4gICAgICAgIHJldHVybiBnZXRQYXNjYWxDYXNlUm91dGVOYW1lKHJvdXRlTm9kZSlcbiAgICAgICAgICAucmVwbGFjZSgvKFthLXpcXGRdKShbQS1aXSkvZywgJyQxLSQyJylcbiAgICAgICAgICAudG9Mb3dlckNhc2UoKVxuICAgICAgfSxcblx0XHRcdC8vIGJlZm9yZVdyaXRlRmlsZXM6IHJvb3QgPT4ge1xuICAgICAgLy8gICByb290Lmluc2VydCgnL2FwcHMvZW1haWwvOmZpbHRlcicsICcvc3JjL3BhZ2VzL2FwcHMvZW1haWwvaW5kZXgudnVlJylcbiAgICAgIC8vICAgcm9vdC5pbnNlcnQoJy9hcHBzL2VtYWlsLzpsYWJlbCcsICcvc3JjL3BhZ2VzL2FwcHMvZW1haWwvaW5kZXgudnVlJylcbiAgICAgIC8vIH0sXG4gICAgfSksXG4gICAgdnVlKHtcbiAgICAgIHRlbXBsYXRlOiB7XG4gICAgICAgIGNvbXBpbGVyT3B0aW9uczoge1xuICAgICAgICAgIGlzQ3VzdG9tRWxlbWVudDogdGFnID0+IHRhZyA9PT0gJ3N3aXBlci1jb250YWluZXInIHx8IHRhZyA9PT0gJ3N3aXBlci1zbGlkZScsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pLFxuICAgIFZ1ZURldlRvb2xzKCksXG4gICAgdnVlSnN4KCksXG5cbiAgICAvLyBEb2NzOiBodHRwczovL2dpdGh1Yi5jb20vdnVldGlmeWpzL3Z1ZXRpZnktbG9hZGVyL3RyZWUvbWFzdGVyL3BhY2thZ2VzL3ZpdGUtcGx1Z2luXG4gICAgdnVldGlmeSh7XG4gICAgICBzdHlsZXM6IHtcbiAgICAgICAgY29uZmlnRmlsZTogJ3NyYy9hc3NldHMvc3R5bGVzL3ZhcmlhYmxlcy9fdnVldGlmeS5zY3NzJyxcbiAgICAgIH0sXG4gICAgfSksXG5cbiAgICAvLyBEb2NzOiBodHRwczovL2dpdGh1Yi5jb20vam9obmNhbXBpb25qci92aXRlLXBsdWdpbi12dWUtbGF5b3V0cyN2aXRlLXBsdWdpbi12dWUtbGF5b3V0c1xuICAgIExheW91dHMoe1xuICAgICAgbGF5b3V0c0RpcnM6ICcuL3NyYy9sYXlvdXRzLycsXG4gICAgfSksXG5cbiAgICAvLyBEb2NzOiBodHRwczovL2dpdGh1Yi5jb20vYW50ZnUvdW5wbHVnaW4tdnVlLWNvbXBvbmVudHMjdW5wbHVnaW4tdnVlLWNvbXBvbmVudHNcbiAgICBDb21wb25lbnRzKHtcbiAgICAgIGRpcnM6IFsnc3JjL0Bjb3JlL2NvbXBvbmVudHMnLCAnc3JjL2NvbXBvbmVudHMnXSxcbiAgICAgIGR0czogdHJ1ZSxcbiAgICAgIHJlc29sdmVyczogW1xuICAgICAgICBjb21wb25lbnROYW1lID0+IHtcbiAgICAgICAgICAvLyBBdXRvIGltcG9ydCBgVnVlQXBleENoYXJ0c2BcbiAgICAgICAgICBpZiAoY29tcG9uZW50TmFtZSA9PT0gJ1Z1ZUFwZXhDaGFydHMnKVxuICAgICAgICAgICAgcmV0dXJuIHsgbmFtZTogJ2RlZmF1bHQnLCBmcm9tOiAndnVlMy1hcGV4Y2hhcnRzJywgYXM6ICdWdWVBcGV4Q2hhcnRzJyB9XG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pLFxuXG4gICAgLy8gRG9jczogaHR0cHM6Ly9naXRodWIuY29tL2FudGZ1L3VucGx1Z2luLWF1dG8taW1wb3J0I3VucGx1Z2luLWF1dG8taW1wb3J0XG4gICAgQXV0b0ltcG9ydCh7XG4gICAgICBpbXBvcnRzOiBbJ3Z1ZScsIFZ1ZVJvdXRlckF1dG9JbXBvcnRzLCAnQHZ1ZXVzZS9jb3JlJywgJ0B2dWV1c2UvbWF0aCcsICd2dWUtaTE4bicsICdwaW5pYSddLFxuICAgICAgZGlyczogW1xuICAgICAgICAnLi9zcmMvQGNvcmUvdXRpbHMnLFxuICAgICAgICAnLi9zcmMvQGNvcmUvY29tcG9zYWJsZS8nLFxuICAgICAgICAnLi9zcmMvY29tcG9zYWJsZXMvJyxcbiAgICAgICAgJy4vc3JjL3V0aWxzLycsXG4gICAgICAgICcuL3NyYy9wbHVnaW5zLyovY29tcG9zYWJsZXMvKicsXG4gICAgICBdLFxuICAgICAgdnVlVGVtcGxhdGU6IHRydWUsXG5cbiAgICAgIC8vIFx1MjEzOVx1RkUwRiBEaXNhYmxlZCB0byBhdm9pZCBjb25mdXNpb24gJiBhY2NpZGVudGFsIHVzYWdlXG4gICAgICBpZ25vcmU6IFsndXNlQ29va2llcycsICd1c2VTdG9yYWdlJ10sXG4gICAgICBlc2xpbnRyYzoge1xuICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICBmaWxlcGF0aDogJy4vLmVzbGludHJjLWF1dG8taW1wb3J0Lmpzb24nLFxuICAgICAgfSxcbiAgICB9KSxcblxuICAgIC8vIERvY3M6IGh0dHBzOi8vZ2l0aHViLmNvbS9pbnRsaWZ5L2J1bmRsZS10b29scy90cmVlL21haW4vcGFja2FnZXMvdW5wbHVnaW4tdnVlLWkxOG4jaW50bGlmeXVucGx1Z2luLXZ1ZS1pMThuXG4gICAgVnVlSTE4blBsdWdpbih7XG4gICAgICBydW50aW1lT25seTogdHJ1ZSxcbiAgICAgIGNvbXBvc2l0aW9uT25seTogdHJ1ZSxcbiAgICAgIGluY2x1ZGU6IFtcbiAgICAgICAgZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYy9wbHVnaW5zL2kxOG4vbG9jYWxlcy8qKicsIGltcG9ydC5tZXRhLnVybCkpLFxuICAgICAgXSxcbiAgICB9KSxcbiAgICBzdmdMb2FkZXIoKSxcbiAgXSxcbiAgZGVmaW5lOiB7ICdwcm9jZXNzLmVudic6IHt9IH0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ0AnOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjJywgaW1wb3J0Lm1ldGEudXJsKSksXG4gICAgICAnQHRoZW1lQ29uZmlnJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3RoZW1lQ29uZmlnLmpzJywgaW1wb3J0Lm1ldGEudXJsKSksXG4gICAgICAnQGNvcmUnOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjL0Bjb3JlJywgaW1wb3J0Lm1ldGEudXJsKSksXG4gICAgICAnQGxheW91dHMnOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjL0BsYXlvdXRzJywgaW1wb3J0Lm1ldGEudXJsKSksXG4gICAgICAnQGltYWdlcyc6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMvYXNzZXRzL2ltYWdlcy8nLCBpbXBvcnQubWV0YS51cmwpKSxcbiAgICAgICdAc3R5bGVzJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYy9hc3NldHMvc3R5bGVzLycsIGltcG9ydC5tZXRhLnVybCkpLFxuICAgICAgJ0Bjb25maWd1cmVkLXZhcmlhYmxlcyc6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMvYXNzZXRzL3N0eWxlcy92YXJpYWJsZXMvX3RlbXBsYXRlLnNjc3MnLCBpbXBvcnQubWV0YS51cmwpKSxcbiAgICAgICdAZGInOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjL3BsdWdpbnMvZmFrZS1hcGkvaGFuZGxlcnMvJywgaW1wb3J0Lm1ldGEudXJsKSksXG4gICAgICAnQGFwaS11dGlscyc6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMvcGx1Z2lucy9mYWtlLWFwaS91dGlscy8nLCBpbXBvcnQubWV0YS51cmwpKSxcbiAgICB9LFxuICB9LFxuICBidWlsZDoge1xuICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogNTAwMCxcbiAgfSxcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgZXhjbHVkZTogWyd2dWV0aWZ5J10sXG4gICAgZW50cmllczogW1xuICAgICAgJy4vc3JjLyoqLyoudnVlJyxcbiAgICBdLFxuICB9LFxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBMFMsU0FBUyxxQkFBcUI7QUFDeFUsT0FBTyxtQkFBbUI7QUFDMUIsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sWUFBWTtBQUNuQixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLGdCQUFnQjtBQUN2QixTQUFTLHNCQUFzQiw4QkFBOEI7QUFDN0QsT0FBTyxlQUFlO0FBQ3RCLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8saUJBQWlCO0FBQ3hCLE9BQU8sYUFBYTtBQUNwQixPQUFPLGFBQWE7QUFDcEIsT0FBTyxlQUFlO0FBWmtLLElBQU0sMkNBQTJDO0FBZXpPLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQTtBQUFBO0FBQUEsSUFHUCxVQUFVO0FBQUEsTUFDUixjQUFjLGVBQWE7QUFFekIsZUFBTyx1QkFBdUIsU0FBUyxFQUNwQyxRQUFRLHFCQUFxQixPQUFPLEVBQ3BDLFlBQVk7QUFBQSxNQUNqQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFLRixDQUFDO0FBQUEsSUFDRCxJQUFJO0FBQUEsTUFDRixVQUFVO0FBQUEsUUFDUixpQkFBaUI7QUFBQSxVQUNmLGlCQUFpQixTQUFPLFFBQVEsc0JBQXNCLFFBQVE7QUFBQSxRQUNoRTtBQUFBLE1BQ0Y7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUNELFlBQVk7QUFBQSxJQUNaLE9BQU87QUFBQTtBQUFBLElBR1AsUUFBUTtBQUFBLE1BQ04sUUFBUTtBQUFBLFFBQ04sWUFBWTtBQUFBLE1BQ2Q7QUFBQSxJQUNGLENBQUM7QUFBQTtBQUFBLElBR0QsUUFBUTtBQUFBLE1BQ04sYUFBYTtBQUFBLElBQ2YsQ0FBQztBQUFBO0FBQUEsSUFHRCxXQUFXO0FBQUEsTUFDVCxNQUFNLENBQUMsd0JBQXdCLGdCQUFnQjtBQUFBLE1BQy9DLEtBQUs7QUFBQSxNQUNMLFdBQVc7QUFBQSxRQUNULG1CQUFpQjtBQUVmLGNBQUksa0JBQWtCO0FBQ3BCLG1CQUFPLEVBQUUsTUFBTSxXQUFXLE1BQU0sbUJBQW1CLElBQUksZ0JBQWdCO0FBQUEsUUFDM0U7QUFBQSxNQUNGO0FBQUEsSUFDRixDQUFDO0FBQUE7QUFBQSxJQUdELFdBQVc7QUFBQSxNQUNULFNBQVMsQ0FBQyxPQUFPLHNCQUFzQixnQkFBZ0IsZ0JBQWdCLFlBQVksT0FBTztBQUFBLE1BQzFGLE1BQU07QUFBQSxRQUNKO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQSxNQUNBLGFBQWE7QUFBQTtBQUFBLE1BR2IsUUFBUSxDQUFDLGNBQWMsWUFBWTtBQUFBLE1BQ25DLFVBQVU7QUFBQSxRQUNSLFNBQVM7QUFBQSxRQUNULFVBQVU7QUFBQSxNQUNaO0FBQUEsSUFDRixDQUFDO0FBQUE7QUFBQSxJQUdELGNBQWM7QUFBQSxNQUNaLGFBQWE7QUFBQSxNQUNiLGlCQUFpQjtBQUFBLE1BQ2pCLFNBQVM7QUFBQSxRQUNQLGNBQWMsSUFBSSxJQUFJLGlDQUFpQyx3Q0FBZSxDQUFDO0FBQUEsTUFDekU7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUNELFVBQVU7QUFBQSxFQUNaO0FBQUEsRUFDQSxRQUFRLEVBQUUsZUFBZSxDQUFDLEVBQUU7QUFBQSxFQUM1QixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLGNBQWMsSUFBSSxJQUFJLFNBQVMsd0NBQWUsQ0FBQztBQUFBLE1BQ3BELGdCQUFnQixjQUFjLElBQUksSUFBSSxvQkFBb0Isd0NBQWUsQ0FBQztBQUFBLE1BQzFFLFNBQVMsY0FBYyxJQUFJLElBQUksZUFBZSx3Q0FBZSxDQUFDO0FBQUEsTUFDOUQsWUFBWSxjQUFjLElBQUksSUFBSSxrQkFBa0Isd0NBQWUsQ0FBQztBQUFBLE1BQ3BFLFdBQVcsY0FBYyxJQUFJLElBQUksd0JBQXdCLHdDQUFlLENBQUM7QUFBQSxNQUN6RSxXQUFXLGNBQWMsSUFBSSxJQUFJLHdCQUF3Qix3Q0FBZSxDQUFDO0FBQUEsTUFDekUseUJBQXlCLGNBQWMsSUFBSSxJQUFJLGdEQUFnRCx3Q0FBZSxDQUFDO0FBQUEsTUFDL0csT0FBTyxjQUFjLElBQUksSUFBSSxvQ0FBb0Msd0NBQWUsQ0FBQztBQUFBLE1BQ2pGLGNBQWMsY0FBYyxJQUFJLElBQUksaUNBQWlDLHdDQUFlLENBQUM7QUFBQSxJQUN2RjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLHVCQUF1QjtBQUFBLEVBQ3pCO0FBQUEsRUFDQSxjQUFjO0FBQUEsSUFDWixTQUFTLENBQUMsU0FBUztBQUFBLElBQ25CLFNBQVM7QUFBQSxNQUNQO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
