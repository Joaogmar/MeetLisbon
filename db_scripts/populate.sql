-- Add Users
insert into users (username, password, role) values ('maria', 'maria123', 'admin');
insert into users (username, password, role) values ('joao', 'joao123', 'admin');
insert into users (username, password, role) values ('afonso', 'afonso123', 'admin');
insert into users (username, password, role) values ('roberta', 'roberta123', 'admin');
insert into users (username, password, role) values ('rodrigo', 'rodrigo123', 'admin');
insert into users (username, password, role) values ('miguel', 'miguel123', 'users');
insert into users (username, password, role) values ('cesar', 'cesar123', 'users');
insert into users (username, password, role) values ('laura', 'laura123', 'users');
insert into users (username, password, role) values ('joana', 'joana123', 'users');
insert into users (username, password, role) values ('bernardo', 'bernardo123', 'users');
insert into users (username, password, role) values ('sofia', 'sofia123', 'users');
insert into users (username, password, role) values ('andre', 'andre123', 'users');
insert into users (username, password, role) values ('goncalo', 'goncalo123', 'users');
insert into users (username, password, role) values ('marta', 'marta123', 'users');
insert into users (username, password, role) values ('martim', 'martim123', 'users');


-- Add Poi
insert into poi (location_name, location_address, longitude, latitude, info, image_url) values ('Padrão dos Descobrimentos', 'Av. Brasília, 1400-038 Lisboa', '-9.205737120817991', '38.693684904994186', 'O Padrão dos Descobrimentos, com 56 metros de altura, é uma homenagem ao Infante d. Henrique que tem a sua própria estátua com um total de 9 metros. <br>
        Este monumento evoca a expansão ultramarina portuguesa com o seu formato de caravela, a figura do Infante e os seus companheiros de viagem. <br>
        Foi construído a primeira vez em 1940 e foi depois deitado a baixo e reconstruído em 1960, por ocasião dos 500 anos da morte do Infante. <br>', 'https://i.imgur.com/n7Q4HHM.jpg');
insert into poi (location_name, location_address, longitude, latitude, info, image_url) values ('Torre de Belém', 'Av. Brasília, 1400-038 Lisboa', '-9.215841104472132', '38.69166125982115', 'A principal função da Torre de Belém era defender a cidade dos ataques feitos pelo rio, que eram bastante frequentes. <br>
        Com o passar dos tempos passou a ter outras funções, como por exemplo, posto de sinalização telegráfico e um farol. <br>
        Foi ainda usada como masmorras para presos políticos. <br>
        Foi desta zona (da praia do Bom Sucesso) que partiram as primeiras naus portuguesas, para a Índia e para o Brasil, na época dos Descobrimentos. <br>', 'https://i.imgur.com/KN7EF21.jpg');
insert into poi (location_name, location_address, longitude, latitude, info, image_url) values ('Armazéns do Chiado', 'R. do Carmo, 1200-094 Lisboa', '-9.139565130866167', '38.711178061135314', 'O Chiado ardeu em 1988 e teve depois de ser completamente reconstruído no que conhecemos hoje como "Os Armazéns do Chiado". <br>
        São um edifício de comércio composto por 55 lojas, incluindo 15 restaurantes. <br>
        As vistas do Chiado sobre a Baixa de Lisboa convertem-no num miradouro privilegiado para todos os que os visitam. <br>', 'https://i.imgur.com/NXLLEv4.jpg');
insert into poi (location_name, location_address, longitude, latitude, info, image_url) values ('Lisboa Story Centre', 'Praça do Comércio 78, 1100-148 Lisboa', '-9.135374845390922', '38.7080016959867', 'O Lisboa Story Centre é um museu, inaugurado em 2012, que  mostra a história e desenvolvimento da cidade. <br>
        Através de equipamento interactivo conta-nos, do passado ao presente, os principais eventos da cidade. <br>
        Mostra-nos tudo, desde a mitologia da sua fundação por Ulisses, a história do sismo de Lisboa de 1755, e a reconstrução da cidade por Sebastião José de Carvalho e Melo, Marquês de Pombal e Conde de Oeiras. <br>', 'https://i.imgur.com/HQ28gm7.jpg');
insert into poi (location_name, location_address, longitude, latitude, info, image_url) values ('Praça Luís de Camões', 'Largo Luís de Camões, 1200-243 Lisboa', '-9.143475756094265', '38.710585946483796', 'A Praça Luís de Camões, localizada no Chiado, tem este nome devido à estátua do poeta Luís de Camões que está no centro da praça. <br>
        Esta estátua foi inaugurada em 1867 e foi impulsionada pela votade de enaltecer o patriotismo como o poeta o faz no livro "Os Lusíadas". <br>
        A figura é de bronze e tem 4 metros de altura, assente sobre um pedestal octogonal, rodeado por oito estátuas: Fernão Lopes, Pedro Nunes, Gomes Eanes de Azurara, João de Barros, Fernão Lopes de Cantanhede, Vasco Mouzinho de Quevedo, Jerónimo Corte-Real e Francisco Sá de Menezes. <br>', 'https://i.imgur.com/8NZp3Kf.jpg');
insert into poi (location_name, location_address, longitude, latitude, info, image_url) values ('Farol de Belém', 'Av. Brasília, 1400-038 Lisboa', '-9.20900014390011', '38.69310423288588', 'Esta torre é um falso farol que nunca funcionou. <br>
        Sendo apenas um elemento turístico situado entre a Torre de Belém e o Padrão dos Descobrimentos. <br>
        Foi construído para a Exposição do Mundo Português em 1940 fazendo parte das histórias dos descobrimentos. <br>', 'https://i.imgur.com/OeB656k.jpg');
insert into poi (location_name, location_address, longitude, latitude, info, image_url) values ('Timeout Market Lisboa', 'Av. 24 de Julho 49, 1200-479 Lisboa', '-9.145917302178974', '38.70720006371532', 'Time Out Market Lisboa é um food hall. <br>
        O conceito passa por juntar os melhores chefs, restaurantes e projetos gastronómicos da capital portuguesa, com base nas recomendações dos críticos e colaboradores da revista Time Out. <br>', 'https://i.imgur.com/gE5UNHa.jpg');
insert into poi (location_name, location_address, longitude, latitude, info, image_url) values ('Arco do Triunfo', 'R. Augusta 2, 1100-053 Lisboa', '-9.136813573550741', '38.708687470695565', 'A construção do Arco do Triunfo foi programada em 1759, no quadro da reconstrução pombalina após a destruição da baixa lisboeta pelo terramoto de 1755. <br>
        A obra do arco triunfal, que já estava fechado em 1862 por ocasião do casamento de D. Luís I, como se observa em fotografias da época, apenas foi concluída em 1873. <br>', 'https://i.imgur.com/PpQSuXD.jpg');
insert into poi (location_name, location_address, longitude, latitude, info, image_url) values ('Estátua D. José I', 'Praça do Comércio MB, 1100-148 Lisboa', '-9.136330775948354', '38.70747350697425', 'O monumento, de 14 m de altura, erguido para homenagear D. José I integra a sua estátua equestre em bronze. <br>
        De influência francesa e a primeira estátua em bronze fundida em Portugal é considerada uma das mais belas estátuas do género em toda a Europa. <br> 
        É também considerada a estátua pública mais antiga de Lisboa e do país. <br>', 'https://i.imgur.com/X5okuwp.jpg');
insert into poi (location_name, location_address, longitude, latitude, info, image_url) values ('IADE', 'Av. Dom Carlos i 4, 1200-649 Lisboa', '-9.152356849095387', '38.70735444022605', 'O IADE – Faculdade de Design Tecnologia e Comunicação da Universidade Europeia, tem sido um laboratório de criatividade, talento e liderança reconhecido por toda a sociedade.<br>
        É hoje uma referência no ensino da criatividade, escola pioneira no ensino do Design em Portugal e uma das melhores na Europa, além de estar entre as primeiras no ensino da Publicidade, do Marketing e da Fotografia. <br>
        Foi fundado, em Lisboa, em 1969, tendo sido pioneiro do ensino do design em Portugal. É, atualmente, a instituição que mais estudantes forma nesta área. <br>', 'https://i.imgur.com/YzVHqOJ.jpg');
insert into poi (location_name, location_address, longitude, latitude, info, image_url) values ('Rua cor de Rosa', 'R. Nova do Carvalho, 1200-370 Lisboa', '-9.143750987043921', '38.70738693564283', 'O nome "Rua Cor de Rosa" surgiu após um projeto de intervenção urbana em 2011, que foi consolidado em 2013. <br>
        A sua pintura marcou o desejo de mudança e transformação desta região, que no passado não tinha uma fama muito simpática em Lisboa. <br>', 'https://i.imgur.com/rK37VGk.jpg');
insert into poi (location_name, location_address, longitude, latitude, info, image_url) values ('Teatro da Trindade INATEL', 'R. Nova da Trindade 9, 1200-301 Lisboa', '-9.14248954471498', '38.71202888351289', 'Em 1866, Francisco Palha, escritor e dramaturgo, decidiu construir o seu próprio teatro. <br>
        Escolheu aquela zona da cidade pela sua antiga vocação cultural e recreativa - aí funcionara, em meados do século XVIII, a Academia da Trindade, o primeiro Teatro Popular de Ópera.<br>', 'https://i.imgur.com/iV2dPdL.jpg');
