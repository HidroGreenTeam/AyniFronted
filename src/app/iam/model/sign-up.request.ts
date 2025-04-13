export class SignUpRequest {
  constructor(
    public fullName: string,
    public email: string,
    public password: string,
  ) {}
}
