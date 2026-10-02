const fs = require('node:fs');
const seed = [...require('../data/home-sections.seed.json'), require('../data/about-page.seed.json'), require('../data/activity-page.seed.json')];
const policy = require('../src/features/home/content/field-policy.json');
const exactObject = properties => ({type:'object',additionalProperties:false,required:Object.keys(properties),properties});
const run = exactObject({text:{type:'string',maxLength:5000},bold:{type:'boolean'},italic:{type:'boolean'},color:{type:'string',pattern:'^(?:#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})|rgba\\(\\s*(?:25[0-5]|2[0-4]\\d|1?\\d?\\d)\\s*,\\s*(?:25[0-5]|2[0-4]\\d|1?\\d?\\d)\\s*,\\s*(?:25[0-5]|2[0-4]\\d|1?\\d?\\d)\\s*,\\s*(?:0(?:\\.\\d+)?|1(?:\\.0+)?)\\s*\\))$'}});
run.required=['text'];
const richText = {type:'array',minItems:1,maxItems:100,items:run};
const schema = {
  $schema:'https://json-schema.org/draft/2020-12/schema',
  title:'Home section document (not seed data)',
  description:'Validate each document separately. model.ts additionally enforces unchanged concatenated text for fixed headings and safe contact/media values.',
  oneOf:seed.map(doc=>exactObject({
    pageKey:{const:doc.pageKey},schemaVersion:{const:1},
    displayName:exactObject({tr:{type:'string',minLength:1,maxLength:120},en:{type:'string',minLength:1,maxLength:120}}),
    content:exactObject(Object.fromEntries(['tr','en'].map(locale=>[locale,exactObject(Object.fromEntries(Object.keys(doc.content[locale]).map(key=>[key,{...richText,description:policy[doc.pageKey][key].textEditable?'Editable text and formatting':'Fixed text; formatting may change'}])))]))),
    ...(doc.media ? {media:exactObject(Object.fromEntries(Object.entries(doc.media).map(([key,value])=>[key,exactObject({localDefault:{const:value.localDefault},externalUrl:{anyOf:[{type:'null'},{type:'string',format:'uri',pattern:'^https://',maxLength:2048},{type:'string',pattern:'^/api/media/[0-9a-f]{24}$',maxLength:35}]}})])))} : {})
  }))
};
fs.writeFileSync('data/home-sections.schema.json',JSON.stringify(schema,null,2)+'\n');
