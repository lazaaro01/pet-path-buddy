import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname ?? "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast({ title: "Bem-vindo de volta!", description: "Login realizado com sucesso." });
      navigate(from, { replace: true });
    } catch {
      toast({
        title: "Erro ao entrar",
        description: "Verifique suas credenciais e tente novamente.",
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
            Cuide de quem faz parte da sua família 🐾
          </h1>
          <p className="text-muted-foreground">
            Entre para continuar acompanhando a localização, atividade e bem-estar dos seus pets
            em tempo real. Segurança e carinho em cada passo.
          </p>
          <p className="text-sm text-muted-foreground">
            “Porque cada caminho é melhor quando estamos juntos.”
          </p>
        </div>

        <Card className="w-full max-w-md mx-auto backdrop-blur-sm bg-card/80 border-border/60 shadow-lg">
          <CardHeader>
            <CardTitle>Entrar</CardTitle>
            <CardDescription>Acesse sua conta para acompanhar seus pets.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" placeholder="voce@exemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" placeholder="Sua senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Não tem uma conta?{" "}
                <Link to="/register" className="text-primary underline">
                  Cadastre-se
                </Link>
              </p>
              <p className="text-xs text-muted-foreground">
                Ao continuar, você concorda com nossos termos e política de privacidade.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;