import * as bcrypt from 'bcrypt';

export const validatePassword = async (
  enteredPassword: string,
  hashedPassword: string,
) => await bcrypt.compare(enteredPassword, hashedPassword);
