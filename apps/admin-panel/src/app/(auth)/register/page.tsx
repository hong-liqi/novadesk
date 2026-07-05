import { BootstrapRegisterGate, RegisterForm } from '@/features/authentication';

export default function RegisterPage() {
  return (
    <BootstrapRegisterGate>
      <RegisterForm />
    </BootstrapRegisterGate>
  );
}
