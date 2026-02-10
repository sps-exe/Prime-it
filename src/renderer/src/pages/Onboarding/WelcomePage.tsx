import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';


export default function WelcomePage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');

    const handleContinue = (e: React.FormEvent) => {
        e.preventDefault();
        navigate('/auth');
    };

    return (
        <div className="h-screen w-full flex items-center justify-center bg-gray-100">
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl w-[400px] text-center">
                {/* Header Section */}
                <div className="flex flex-col items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-tr from-teal-400 to-blue-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-teal-500/30">
                        <CheckCircle2 className="w-8 h-8 text-white" />
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Prime-it</h1>
                    <p className="text-gray-500 text-sm">
                        Time to <span className="text-purple-600 font-semibold">focus</span> and prime your tasks.
                    </p>
                </div>

                {/* Form Section */}
                <form onSubmit={handleContinue} className="space-y-4">
                    <Input
                        type="email"
                        placeholder="Login/Signup via email"
                        icon={<Mail className="w-5 h-5" />}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoFocus
                    />

                    <Button
                        fullWidth
                        disabled={!email}
                        className="w-full py-3 rounded-lg bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-bold mt-4 hover:opacity-90 transition"
                    >
                        CONTINUE
                    </Button>

                    <div className="pt-4 text-center">
                        <p className="text-[10px] text-gray-400">
                            By clicking "Continue", you agree to Prime-it's <a href="#" className="underline">Terms</a> and <a href="#" className="underline">Privacy Policy</a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
