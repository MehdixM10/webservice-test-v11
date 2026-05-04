import { DOMParser, Element } from "@xmldom/xmldom";
import { writeFile } from "fs/promises";

/**
 *
 * @param webService Name of the web server function in X3
 * @param params web server function params to call, be carefull the params should match the X3 @param operation params and the schemas (XML ou JSON)
 * @param returnParams The names of the output params, you want to get as results of this call
 * @param typeRequest The result response type, inside the xml tag <resultXml>
 * @param operation The operation to call in X3, see the list of operations
 * @param soapAction IDK, probalbly the soap Acion in the list of operations
 * @param trace activate or deactivate the functions trace call, in X3 web service, if errors uncoutred the resposnse dumped in a log file
 */
export async function callWS(
  webService: string,
  params: string | Object,
  returnParams: string[],
  typeRequest: "JSON" | "XML" = "JSON",
  operation:
    | "run"
    | "save"
    | "delete"
    | "read"
    | "query"
    | "getDescription"
    | "modify"
    | "actionObject"
    | "actionObjectKeys"
    | "getDataXmlSchema"
    | "insertLines"
    | "deleteLines" = "run",
  soapAction: string = "",
  trace: "on" | "off" = "off",
) {
  const xml = `<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:wss="http://www.adonix.com/WSS">
     <soapenv:Header/>
     <soapenv:Body>
        <wss:${operation}  soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
            <callContext xsi:type="wss:CAdxCallContext">
              <codeLang xsi:type="xsd:string">${process.env.CODE_LANG}</codeLang>
              <poolAlias xsi:type="xsd:string">${process.env.POOL_ALIAS}</poolAlias>
              <poolId xsi:type="xsd:string">${process.env.POOL_ID}</poolId>
              <requestConfig xsi:type="xsd:string">adxwss.optreturn=${typeRequest}&adxwss.beautify=true&adxwss.trace.on=${trace}</requestConfig>
            </callContext>
            <publicName xsi:type="xsd:string">${webService}</publicName>
            <inputXml xsi:type="xsd:string">${typeRequest === "JSON" ? JSON.stringify(params) : "<![CDATA[" + params + "]]>"}</inputXml>
        </wss:${operation} >
     </soapenv:Body>
  </soapenv:Envelope>`;

  // Transforms strings to base64 encoded string
  const auth = btoa(`${process.env.X3_USERNAME}:${process.env.X3_PASSWORD}`);

  const response = await fetch(process.env.URL!, {
    method: "POST",
    headers: {
      "Content-Type": "text/xml;charset=UTF-8",
      soapAction: `"${soapAction}"`, // required by Sage
      Authorization: `Basic ${auth}`,
    },
    body: xml,
  });

  const soapXml = await response.text();
  const errorFileName = "./error-result-xml.xml";
  // Parsing
  const parsedXml = new DOMParser().parseFromString(soapXml, "text/xml");
  // Extract result & status
  const resultXml = parsedXml.getElementsByTagName("resultXml").item(0);
  const status = parsedXml.getElementsByTagName("status").item(0);

  if (Number(status?.textContent) != 1) {
    const messages = parsedXml.getElementsByTagName("message");
    let errOutput = trace === "on" ? "Erreur messages:\n" : "";
    for (let i = 0; i < messages.length; ++i)
      errOutput += messages.item(i)?.textContent + "\n";
    if (trace === "on") {
      await writeFile(errorFileName, soapXml, "utf-8");
      errOutput +=
        "\n=> you can read the full response xml in " + errorFileName;
    }
    throw new Error(errOutput);
  }

  if (resultXml && !resultXml?.getAttribute("xsi:nil")) {
    const map = new Map<string, string | string[]>(
      returnParams.map((key, i) => [key, []]),
    );
    switch (typeRequest) {
      case "JSON":
        extractJsonResponse(map, resultXml);
        break;
      case "XML":
        extractXmlResponse(map, resultXml);
        break;
    }
    return map;
  }
  return null;
}

function extractXmlResponse(
  map: Map<string, string | string[]>,
  resultXml: Element,
) {
  // Parsing CDATA
  const response = new DOMParser().parseFromString(
    resultXml.textContent ?? "",
    "text/xml",
  );
  const result = response.getElementsByTagName("RESULT").item(0);
  const flds = result?.getElementsByTagName("FLD");
  if (!flds) return null;
  for (let i = 0; i < flds.length; ++i) {
    const fld = flds.item(i);
    const name = fld?.getAttribute("NAME");
    if (name && map.keys().toArray().includes(name)) {
      if (fld?.parentElement?.tagName == "LIN") {
        (map.get(name) as string[])?.push(fld?.textContent ?? "");
      } else {
        map.set(name, fld?.textContent ?? "");
      }
    }
  }
}
// TODO : fix all the values are in arrays
function extractJsonResponse(
  map: Map<string, string | string[]>,
  resultXml: Element,
) {
  // Parsing CDATA
  const response = JSON.parse(resultXml.textContent ?? "");
  const flattenObjs = Object.values(response).flat();
  for (const name of map.keys().toArray()) {
    for (const obj of flattenObjs) {
      if (Object.keys(obj as string).includes(name))
        (map.get(name) as string[]).push((obj as any)[name]);
    }
  }
}
