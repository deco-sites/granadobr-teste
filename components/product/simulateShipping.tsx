import { h } from "preact";
import { useState } from "preact/hooks";
import { invoke } from "../../runtime.ts";

interface SimulateShippingProps {
  sku: string;
}

const SimulateShipping = ({ sku }: SimulateShippingProps) => {
  const [cep, setCep] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await invoke.site.actions.simularFrete({ sku, cep });
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch (err) {
      setError("Erro ao consultar o frete.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
    <form onSubmit={handleSubmit} class="max-w-[400px] flex flex-col gap-[16px] pb-0 ">
      <span class="font-medium text-[18px] leading-[1.25] text-black font-matria">
        Consultar opções de entrega
      </span>     
      <div class="flex flex-col gap-2 w-full">
        <div class="flex flex-row gap-4 items-center">  
          <input
            type="text"
            value={cep}
            onInput={e => setCep((e.target as HTMLInputElement).value)}
            onFocus={e => {
              e.currentTarget.parentElement!.style.opacity = "1";
            }}
            onBlur={e => {
              if (!e.currentTarget.value) {
                e.currentTarget.parentElement!.style.opacity = "0.5";
              }
            }}
            required
            placeholder="Informe seu CEP"
            class="bg-[#F6F3F8] border-none rounded-[5px] px-4 py-2 font-matria text-[16px] text-[#B7B6B6] flex-1 outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            class={`bg-white border border-[#333] rounded-[5px] px-4 py-2 font-medium text-[16px] text-[#333] transition-opacity ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80 cursor-pointer'}`}
          >
            {loading ? "Calculando..." : "Consultar"}
          </button>
        </div>
        <a
          href="https://buscacepinter.correios.com.br/app/endereco/index.php"
          target="_blank" 
          rel="noopener noreferrer"
          class="font-matria text-[16px] text-[#999] underline mt-1 self-start"
        >
          Não sei meu CEP
        </a>
      </div>
      {error && <div class="text-red-600 mt-2">{error}</div>}
      {result && Array.isArray(result) && (
        <div class="mt-4 flex flex-col gap-4 py-4">
          {result.map((opcao: any, idx: number) => (
            <div
              class={`flex flex-row items-center w-full pb-4 ${idx < result.length - 1 ? 'border-b border-[#E7E7E7]' : ''}`}
              key={opcao.carrier_code + '-' + idx}
            >
              <span class="font-medium text-[16px] text-[#666] font-matria min-w-[120px]">
                {opcao.carrier_title}
              </span>
              {opcao.method_title ? (
                <span class="font-normal text-[16px] text-[#333] font-matria flex-1 text-center">
                  {opcao.method_title}
                </span>
              ) : <span class="flex-1"></span>}
              <span class="font-medium text-[16px] font-matria min-w-[70px] text-right" style={{ color: '#005239' }}>
                {Number(opcao.amount) === 0 ? 'Grátis' : `R$ ${Number(opcao.amount).toFixed(2).replace('.', ',')}`}
              </span>
            </div>
          ))}

          {/* Mensagem 1: Frete grátis */}
          <div class="flex flex-row items-center w-full bg-[#F6F3F8] rounded-[5px] px-5 py-4 mt-2 gap-6">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.75 20.4167C22.75 21.1902 22.4427 21.9321 21.8957 22.4791C21.3487 23.026 20.6069 23.3333 19.8333 23.3333C19.0598 23.3333 18.3179 23.026 17.7709 22.4791C17.224 21.9321 16.9167 21.1902 16.9167 20.4167C16.9167 19.6431 17.224 18.9013 17.7709 18.3543C18.3179 17.8073 19.0598 17.5 19.8333 17.5C20.6069 17.5 21.3487 17.8073 21.8957 18.3543C22.4427 18.9013 22.75 19.6431 22.75 20.4167ZM11.0833 20.4167C11.0833 21.1902 10.776 21.9321 10.2291 22.4791C9.68208 23.026 8.94021 23.3333 8.16667 23.3333C7.39312 23.3333 6.65125 23.026 6.10427 22.4791C5.55729 21.9321 5.25 21.1902 5.25 20.4167C5.25 19.6431 5.55729 18.9013 6.10427 18.3543C6.65125 17.8073 7.39312 17.5 8.16667 17.5C8.94021 17.5 9.68208 17.8073 10.2291 18.3543C10.776 18.9013 11.0833 19.6431 11.0833 20.4167Z" stroke="#005239" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16.9166 20.4167H11.0833M17.4999 18.0834V8.16669C17.4999 6.51702 17.4999 5.69219 16.9866 5.18002C16.4756 4.66669 15.6508 4.66669 13.9999 4.66669H5.83325C4.18359 4.66669 3.35875 4.66669 2.84659 5.18002C2.33325 5.69102 2.33325 6.51585 2.33325 8.16669V17.5C2.33325 18.5909 2.33325 19.1357 2.56775 19.5417C2.72134 19.8077 2.94224 20.0286 3.20825 20.1822C3.61425 20.4167 4.15909 20.4167 5.24992 20.4167M18.0833 7.58335H20.1844C21.1528 7.58335 21.6369 7.58335 22.0383 7.81085C22.4396 8.03719 22.6881 8.45252 23.1863 9.28319L25.1684 12.5849C25.4158 12.9979 25.5394 13.2055 25.6036 13.4342C25.6666 13.664 25.6666 13.9044 25.6666 14.3862V17.5C25.6666 18.5909 25.6666 19.1357 25.4321 19.5417C25.2785 19.8077 25.0576 20.0286 24.7916 20.1822C24.3856 20.4167 23.8408 20.4167 22.7499 20.4167" stroke="#005239" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg> 
            <span class="font-matria text-[16px] text-[#333] flex-1">
          
              <strong>Frete grátis disponível:</strong> em pedidos acima de R$250,00
            </span>
            <a
              href="/granado/regrasepromocoes" 
              class="font-matria text-[15px] text-[#333] underline"
              style={{ minWidth: '80px', textAlign: 'right' }}
            >
              Ver regras
            </a>
          </div>

          {/* Mensagem 2: Retirada na loja (condicional) */}
          {result.some((opcao: any) =>
            (opcao.method_title && opcao.method_title.toLowerCase().includes('retirada')) ||
            (opcao.carrier_title && opcao.carrier_title.toLowerCase().includes('retirada'))
          ) && (
            <div class="flex flex-row items-center w-full bg-[#F6F3F8] rounded-[5px] px-5 py-4 mt-2 gap-6">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24.3647 12.2124V23.0741C24.3647 23.7617 24.0916 24.4211 23.6054 24.9073C23.1192 25.3935 22.4598 25.6666 21.7722 25.6666H6.22761C5.54026 25.6663 4.88118 25.393 4.39528 24.9068C3.90937 24.4207 3.63641 23.7614 3.63641 23.0741V12.2124M8.16939 9.78702L8.81752 2.33331M8.16939 9.78702C8.16939 13.5489 13.9999 13.5489 13.9999 9.78702M8.16939 9.78702C8.16939 13.9041 1.48723 13.0537 2.42312 9.46553L3.7777 4.27128C3.92247 3.7165 4.24705 3.22536 4.70066 2.87471C5.15427 2.52405 5.71131 2.33366 6.28465 2.33331H21.7152C22.2885 2.33366 22.8456 2.52405 23.2992 2.87471C23.7528 3.22536 24.0774 3.7165 24.2221 4.27128L25.5767 9.46553C26.5126 13.055 19.8304 13.9041 19.8304 9.78702M13.9999 9.78702V2.33331M13.9999 9.78702C13.9999 13.5489 19.8304 13.5489 19.8304 9.78702M19.8304 9.78702L19.1823 2.33331" stroke="#005239" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span class="font-matria text-[16px] text-[#333] flex-1">
              
                <strong>Retirada em loja:</strong> em até 1 dia útil nas lojas mais próximas
              </span>
              <a
                href="/granado/retire-em-loja-e-entrega-expressa"
                class="font-matria text-[15px] text-[#333] underline"
                style={{ minWidth: '80px', textAlign: 'right' }}
              >
                Ver regras
              </a>
            </div>
          )}
        </div> 
      )}
    </form>
    <hr class="w-full mt-6 hidden md:block md:border-t md:border-gray-300"/>
    </div>
  );   
};

export default SimulateShipping;
  