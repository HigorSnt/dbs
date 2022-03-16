import { commands } from '../language/plsql/index.js';
import {
  DROP_TEMPLATE,
  PARAMETER_TEMPLATE,
  PROCEDURE_TEMPLATE,
} from '../language/plsql/template/index.js';
import { Parameter, Procedure } from '../models/index.js';

import {
  createScript as createGrantScript,
  revokeScript as revokeGrantScript,
} from './grant.js';

export const createScript = (procedureObject: Procedure): string => {
  const {
    replace = false,
    name = '',
    schemaName = '',
    parameters = [],
    declarations = [],
    executionBody = [],
    exceptionBody = [],
    grants = [],
    is = false,
  } = procedureObject;

  const procedureName = schemaName ? `${schemaName}.${name}` : name;
  const replaceValue = replace ? `${commands.or} ${commands.replace}` : '';
  const isOrAs = is ? `${commands.is}` : `${commands.as}`;
  const parameterScript = createParametersScripts(parameters);
  const grantScripts = grants.map(createGrantScript);

  const procedureScript = PROCEDURE_TEMPLATE.replace('<replace>', replaceValue)
    .replaceAll('<object_name>', procedureName)
    .replace('<parameters>', parameterScript)
    .replace('<is_or_as>', isOrAs)
    .replace('<declaration>', declarations.join(';\n'))
    .replace('<execution_body>', executionBody.join(';\n'))
    .replace('<exception_body>', exceptionBody.join(';\n'));

  return `${procedureScript}\n\n${grantScripts.join('\n\n')}`;
};

const createParametersScripts = (parameters: Parameter[]): string => {
  const scripts = [];

  for (const parameter of parameters) {
    const { name, type, in: inClause, out } = parameter;

    const script = PARAMETER_TEMPLATE.replace('<parameter_name>', name)
      .replace('<in>', inClause ? commands.in : '')
      .replace('<out>', out ? commands.out : '')
      .replace('<type>', type);
    scripts.push(script);
  }

  return `(${scripts.join(', ')})`;
};

export const dropScript = (procedureObject: Procedure): string => {
  const { name = '', schemaName = '', grants = [] } = procedureObject;
  const procedureName = schemaName ? `${schemaName}.${name}` : name;

  const dropProcedure = DROP_TEMPLATE.replace(
    '<database_object>',
    commands.procedure
  ).replace('<object_name>', procedureName);

  const revokeGrants = grants.map(revokeGrantScript);

  return `${dropProcedure}\n\n${revokeGrants.join('\n\n')}`;
};
