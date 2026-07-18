import Image from "next/image";
import LoginForm from "./LoginForm";

export default function LoginPage() {
    return (
        <main className="relative min-h-screen flex items-center justify-center p-4">
            {/* Background image */}
            <Image
                src="/images/loginBG.png"
                alt=""
                fill
                priority
                className="object-cover"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-trenza-fondo/40" />

            {/* Login form */}
            <div className="relative z-10 w-full max-w-md bg-trenza-crema rounded-3xl p-9">
                <div className="flex flex-col items-center gap-3 mb-6">
                    <Image src="/images/logo.png" alt="Nacional de Trenzados" width={240} height={0} />
                    <h1 className="font-display font-bold text-trenza-azul text-center tracking-wide">
                        NACIONAL DE TRENZADOS
                    </h1>
                    {/* divisor */}
                    <svg width="140" height="14" viewBox="0 0 140 14">
                        <path d="M0 7 Q17.5 0 35 7 T70 7 T105 7 T140 7" fill="none" stroke="#B90004" strokeWidth="2" />
                        <path d="M0 7 Q17.5 14 35 7 T70 7 T105 7 T140 7" fill="none" stroke="#3A4A63" strokeWidth="2" />
                    </svg>
                </div>

                <LoginForm />
            </div>
        </main>
    );
}