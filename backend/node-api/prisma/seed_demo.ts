import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const darijaConvos = [
  {
    name: "Karim Benchikhi",
    phone: "+212600112233",
    status: "lead",
    messages: [
      { text: "Salam, bghit nsowlek 3la dak sbbat wach mazal disponible?", sent: false },
      { text: "Wa alaykoum salam. Ah akhoya mazal kayn, chhal nra bghiti?", sent: true },
      { text: "Bghit nra 42 flkhal. Chhal tawsil l Casa?", sent: false },
      { text: "Tawsil 30dh l Casa. Sift lia smya w l'adresse w raqm tilifon", sent: true },
      { text: "Wakha khoya, smya Karim Benchikhi, ...", sent: false }
    ]
  },
  {
    name: "Fatima Ezzahra",
    phone: "+212611223344",
    status: "engaged",
    messages: [
      { text: "Salam, chhal lwaqt bach ywselni lcommande diali?", sent: false },
      { text: "Salam lalla Fatima. Tawsil kayakhod 24h htal 48h.", sent: true },
      { text: "Ok, hta ywsel w nkhlleskom, mzyan?", sent: false },
      { text: "Ah lalla, tawsil htal bab dar w lkhalass à la livraison.", sent: true }
    ]
  },
  {
    name: "Youssef Amrani",
    phone: "+212622334455",
    status: "qualified",
    messages: [
      { text: "Salam, wach t9adro tsifto l'Oujda?", sent: false },
      { text: "Salam khoya Youssef, ah kantsifto l ga3 lmodon, 40dh l tawsil l'Oujda.", sent: true },
      { text: "Mzyan, bghit 2 pièces mn hadak lmodele lekhel.", sent: false },
      { text: "Mrehba akhoya, tsjelna lcommande dialk. Ghan siftoha lyoum.", sent: true }
    ]
  },
  {
    name: "Amina Tazi",
    phone: "+212633445566",
    status: "won",
    messages: [
      { text: "Salam, wselni sbbat, saraha zwin w jatni nra hiya hadik.", sent: false },
      { text: "Bsha w raha a lalla Amina! Mrehba bik f ay waqt.", sent: true },
      { text: "Lah ybarfek fik. Wach andkom chi modelat khrin nfss style?", sent: false },
      { text: "Ah kayna had la collection jdida, choufi had tswira.", sent: true }
    ]
  },
  {
    name: "Hassan El Fassi",
    phone: "+212644556677",
    status: "won",
    messages: [
      { text: "Salam khoya, sift lik laflous f CIH.", sent: false },
      { text: "Salam si Hassan. Wakha nverifié w nred 3lik lkhbar.", sent: true },
      { text: "Ok.", sent: false },
      { text: "Dazt laflous. Lcommande dialk raha f triq.", sent: true }
    ]
  },
  {
    name: "Mehdi Lahlou",
    phone: "+212655667788",
    status: "lead",
    messages: [
      { text: "Salam, khoya chhal akhir taman dial had lcasquette?", sent: false },
      { text: "Salam khoya Mehdi, taman mfixi 150dh, mafihch mofahama.", sent: true },
      { text: "Wakha zaydin chwiya, mais bghitha. sift lia whda.", sent: false },
      { text: "Mrehba! 3tini l'adresse exacte dialk.", sent: true }
    ]
  },
  {
    name: "Salma Idrissi",
    phone: "+212666778899",
    status: "engaged",
    messages: [
      { text: "Wach kayna chi garantie 3la had l'appareil?", sent: false },
      { text: "Ah bien sûr lalla, kayna garantie dial 6 chhor contra les défauts de fabrication.", sent: true },
      { text: "Safi ntwklo 3la lah. Sift lia whda l Rabat.", sent: false },
      { text: "Mrehba, aytaslo bik lyoum f la عشية.", sent: true }
    ]
  },
  {
    name: "Omar Benjelloun",
    phone: "+212677889900",
    status: "lead",
    messages: [
      { text: "Khoya l'adresse dyali hiya: 15 rue des far, Marrakech.", sent: false },
      { text: "Chokran khoya Omar. Rakom tsjelto. Lcommande ghadya tkhroj gheda f sba7.", sent: true },
      { text: "Wakha, mat3tloch 3afak lahit msater.", sent: false },
      { text: "Matkhafch, 24h w tkoun andk.", sent: true }
    ]
  },
  {
    name: "Amine Chraibi",
    phone: "+212688990011",
    status: "won",
    messages: [
      { text: "Bghit n'annuler lcommande diali ila kan momkin.", sent: false },
      { text: "Salam si Amine. Wakha akhoya, machi mochkil. chno sbab?", sent: true },
      { text: "Safi chrit whda khra men 3nd wahed sahbi.", sent: false },
      { text: "Wakha machi mochkil, mara khra inshaAllah.", sent: true }
    ]
  },
  {
    name: "Khadija Berrada",
    phone: "+212699001122",
    status: "qualified",
    messages: [
      { text: "Salam, wach ymkenn lya nbadal la couleur dyal sbbat?", sent: false },
      { text: "Salam lalla Khadija. Lcommande ba9i matsiftatch, ymkenn lik tbaddli. Chno bghiti?", sent: true },
      { text: "Bghit lmarron au lieu dial lkhal.", sent: false },
      { text: "Safi tsjel. Lmarron ghadi ywselk.", sent: true }
    ]
  },
  {
    name: "Nabil Zeroual",
    phone: "+212600223344",
    status: "won",
    messages: [
      { text: "Khoya sbbat jani sghir chwiya, wach momkin nbddlo?", sent: false },
      { text: "Salam si Nabil. Ah momkin, ghatkhales ghir lretour dial l'amanat.", sent: true },
      { text: "Wakha, chhal l'amanat?", sent: false },
      { text: "40dh. Sift lina sbbat w nsiifto lik nra kber.", sent: true }
    ]
  },
  {
    name: "Hicham Alaoui",
    phone: "+212611334455",
    status: "lead",
    messages: [
      { text: "Salam, ana bghit 3 pieces, tkhlihom liya b 500dh?", sent: false },
      { text: "Salam si Hicham. Nkhalliwhom lik b 550dh akhir taman.", sent: true },
      { text: "Safi wakha. Ha l'adresse: Tanger, hay ahlan...", sent: false },
      { text: "Mrehba, ghanwewjdoha lik daba.", sent: true }
    ]
  },
  {
    name: "Meryem Belkacem",
    phone: "+212622445566",
    status: "engaged",
    messages: [
      { text: "Wach kayn chi remise f had la fin d'année?", sent: false },
      { text: "Salam lalla. Ah kayna remise de 20% 3la koulchi.", sent: true },
      { text: "Zwin hadchi, chhal yweli taman dial le sac rouge?", sent: false },
      { text: "Yweli b 160dh f blaste 200dh.", sent: true }
    ]
  },
  {
    name: "Ilias Touzani",
    phone: "+212633556677",
    status: "won",
    messages: [
      { text: "Sift lik tswira dyal reçu dial lbanka.", sent: false },
      { text: "Chokran si Ilias. Dazet laflous.", sent: true },
      { text: "Imta ghadi ywselni?", sent: false },
      { text: "Ghadi ywselk f yomayn inshaAllah.", sent: true }
    ]
  },
  {
    name: "Sara Qacemi",
    phone: "+212644667788",
    status: "lead",
    messages: [
      { text: "Salam, bghit nsewlek wach lproduit original?", sent: false },
      { text: "Salam lalla Sara. Ah 100% original w m3ah certifat.", sent: true },
      { text: "Mzyan, yallah comandi liya whda. Chhal taman kamel b tawsil?", sent: false },
      { text: "Taman howa 300dh, w tawsil fabor.", sent: true }
    ]
  }
];

async function main() {
    console.log('Starting seed demo...');
    
    // Find a team and an admin user to attach these to
    const adminTeam = await prisma.team.findFirst({
        where: { name: 'Wasla Administration' }
    });

    if (!adminTeam) {
        console.error("Could not find Wasla Administration team. Finding any team...");
    }

    const team = adminTeam || await prisma.team.findFirst();

    if (!team) {
        console.error("No team found. Please run regular seed first.");
        return;
    }

    const assignedUser = await prisma.user.findFirst({
        where: { teamId: team.id }
    });

    console.log(`Adding 15 fake contacts to team: ${team.name}`);

    for (const data of darijaConvos) {
        // Create the contact
        const contact = await prisma.contact.create({
            data: {
                name: data.name,
                phone: data.phone,
                status: data.status,
                teamId: team.id,
                assignedToId: assignedUser?.id || null,
                lastMessage: data.messages[data.messages.length - 1].text,
                unread: data.messages[data.messages.length - 1].sent ? 0 : 1, // 1 unread if last msg is from customer
                messages: {
                    create: data.messages.map(m => ({
                        text: m.text,
                        sent: m.sent,
                        teamId: team.id
                    }))
                }
            }
        });
        console.log(`Created contact: ${contact.name}`);
    }

    console.log('Demo data seeded successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
