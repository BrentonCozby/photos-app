// Half of a deliberate cycle. architecture.spec.ts points the no-circular rule at
// this directory to prove the rule still fires; nothing else imports it.
import { b } from './circularB'

export const a = () => b
