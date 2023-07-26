import { HelmetServerState } from 'react-helmet-async'
import serialize from 'serialize-javascript'
import { RootState } from 'store/store'

interface TTemplate {
  header: string
  footer: string
}

const renderMetaData = (helmetData: HelmetServerState) => {
  if(helmetData){
    return helmetData?.title.toString() + helmetData?.meta.toString()
  }else{
    return ''
  }
}
export const getHtmlTemplate = (props: {
  preloadedState: Partial<RootState>
  helmetData: HelmetServerState
  scriptTags: string
  styleTags: string
  nonce: string
  lang?: string
}): TTemplate => ({
  header: `
    <!DOCTYPE html>
      <html lang="${props.lang == null ? 'en' : props.lang}">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1">
            <meta property="csp-nonce" content="${props.nonce}">
            ${props.styleTags}
            ${renderMetaData(props.helmetData)}
        </head>
        <body>
          <noscript>
            <b>Enable JavaScript to run this app.</b>
          </noscript>
          <div id="root">`,
  footer: `</div>
          <script nonce="${
            props.nonce
          }">window.__PRELOADED_STATE__ = ${serialize(
    props.preloadedState
  )}</script>
          ${props.scriptTags}
        </body>
      </html>
  `
})
