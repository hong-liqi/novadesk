import { getApiBaseUrl, serializeRuntimeApiUrlScript } from '@novadesk/sdk';

export function RuntimeConfigScript() {
  const apiUrl = getApiBaseUrl();

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: serializeRuntimeApiUrlScript(apiUrl),
      }}
    />
  );
}
