import { ZodIssue } from 'zod';

const zodErrorHelper = (issues: ZodIssue[]): string => {
  const issue = issues[0];
  return `${issue.path[0]} is ${issue.code.split('_').join(' ')}. ${
    issue.message
  }`;
};

export { zodErrorHelper };
