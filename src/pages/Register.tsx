import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password);
      toast({ title: "Conta criada!", description: "Cadastro realizado com sucesso." });
      navigate("/", { replace: true });
    } catch {
      toast({
        title: "Erro no cadastro",
        description: "Não foi possível criar sua conta. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/15 via-secondary/10 to-accent/15 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid gap-6 md:grid-cols-2 items-center">
        <div className="text-center md:text-left space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Comece a proteger o caminho do seu melhor amigo
          </h1>
          <p className="text-muted-foreground">
            Crie sua conta e tenha o controle da jornada dos seus pets — localização, alertas
            inteligentes e muito mais.
          </p>
          <p className="text-sm text-muted-foreground">
            “Cuidar é estar por perto, mesmo à distância.”
          </p>
        </div>

        <Card className="w-full max-w-md mx-auto backdrop-blur-sm bg-card/80 border-border/60 shadow-lg">
          <CardHeader>
            <CardTitle>Criar conta</CardTitle>
            <CardDescription>Comece a monitorar seus pets agora.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" placeholder="voce@exemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" placeholder="Crie uma senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Cadastrando..." : "Cadastrar"}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Já tem uma conta?{" "}
                <Link to="/login" className="text-primary underline">
                  Entrar
                </Link>
              </p>
              <p className="text-xs text-muted-foreground">
                Ao criar sua conta você concorda com nossos termos e política de privacidade.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;