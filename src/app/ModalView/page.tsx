// pages/post/view.tsx

import { PostDisplay } from "@/app/components/ModalViewMemorie";

// Dados simulados (mock) para teste.
// Em uma aplicação real, você buscaria esses dados de uma API.
const mockPostData = {
  title: "Uma Viagem Incrível pelas Montanhas",
  media: {
    // Exemplo com Imagem:
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
    type: 'image' as const,
    // Exemplo com Vídeo (descomente para testar):
    // url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    // type: 'video' as const,
  },
  comments: [
    { text: "Que paisagem espetacular! Onde fica?" },
    { text: "Uau, as cores do céu estão perfeitas." },
    { text: "Tenho que adicionar este lugar à minha lista de viagens." },
    { text: "A composição da foto ficou muito profissional." },
    { text: "Parece um lugar muito tranquilo para relaxar e meditar." },
    { text: "Incrível! Adoraria ver mais fotos dessa aventura." },
    { text: "Isso me lembra de uma viagem que fiz no ano passado." },
    { text: "Obrigado por compartilhar essa vista maravilhosa conosco!" },
    { text: "Qual câmera você usou para capturar essa imagem?" },
    { text: "Simplesmente deslumbrante." },
    { text: "Estou sem palavras!" },
  ],
};

const ViewPostPage = () => {
  // Em um cenário real, você usaria 'getStaticProps' ou 'getServerSideProps'
  // para buscar os dados do post pelo ID e passá-los para o componente.
  return <PostDisplay post={mockPostData} />;
};

export default ViewPostPage;