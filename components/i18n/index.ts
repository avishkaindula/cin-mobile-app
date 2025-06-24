import { I18n } from 'i18n-js';

// Set the key-value pairs for the different languages you want to support.
const translations = {
  en: {
    // Navigation
    home: 'Home',
    missions: 'Missions',
    map: 'Map',
    community: 'Community',
    profile: 'Profile',
    settings: 'Settings',
    
    // Common
    welcome: 'Welcome to Climate Intel',
    loading: 'Loading...',
    error: 'Error',
    retry: 'Retry',
    save: 'Save',
    cancel: 'Cancel',
    done: 'Done',
    
    // App specific
    climateIntel: 'Climate Intel',
    climateIntelligenceNetwork: 'Climate Intelligence Network',
    empoweringClimateAction: 'Empowering Climate Action Through Data',
    
    // Home page
    homeWelcome: 'Welcome to Climate Intelligence Network',
    homeDescription: 'Equipping Global South citizens with tools for climate justice',
    
    // Missions
    activeMissions: 'Active Missions',
    completedMissions: 'Completed Missions',
    joinMission: 'Join Mission',
    
    // Advanced Missions
    allMissions: 'All Missions',
    myMissions: 'My Missions',
    searchMissions: 'Search missions...',
    filterBy: 'Filter by',
    sortBy: 'Sort by',
    category: 'Category',
    status: 'Status',
    newest: 'Newest',
    popular: 'Popular',
    highestReward: 'Highest Reward',
    dataCollection: 'Data Collection',
    research: 'Research',
    awareness: 'Awareness',
    action: 'Action',
    ongoing: 'Ongoing',
    completed: 'Completed',
    upcoming: 'Upcoming',
    participants: 'participants',
    daysLeft: 'days left',
    hoursLeft: 'hours left',
    viewDetails: 'View Details',
    startMission: 'Start Mission',
    continueMission: 'Continue Mission',
    missionCompleted: 'Mission Completed',
    progress: 'Progress',
    
    // Map
    climateData: 'Climate Data',
    yourLocation: 'Your Location',
    nearbyStations: 'Nearby Stations',
    
    // Community
    discussions: 'Discussions',
    events: 'Events',
    stories: 'Stories',
    communitySubtitle: 'Connect, learn, and act together for climate change',
    featuredCommunities: 'Featured Communities',
    recentDiscussions: 'Recent Discussions',
    upcomingEvents: 'Upcoming Events',
    myCommunities: 'My Communities',
    startDiscussion: 'Start Discussion',
    createEvent: 'Create Event',
    viewAll: 'View All',
    active: 'active',
    view: 'View',
    join: 'Join',
    by: 'by',
    replies: 'replies',
    attending: 'attending',
    joined: 'Joined',
    impactPoints: 'Impact Points',
    
    // Profile
    myProfile: 'My Profile',
    contributions: 'Contributions',
    achievements: 'Achievements',
    editProfile: 'Edit Profile',
    
    // Leagues and Progress
    league: 'League',
    currentLeague: 'Current League',
    bronzeLeague: 'Bronze League',
    silverLeague: 'Silver League',
    goldLeague: 'Gold League',
    platinumLeague: 'Platinum League',
    diamondLeague: 'Diamond League',
    pointsToNext: 'points to next league',
    points: 'points',
    
    // Featured Missions
    featuredMissions: 'Featured Missions',
    viewAllMissions: 'View all missions >',
    event: 'Event',
    task: 'Task',
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    expert: 'Expert',
    
    // Campaigns
    campaigns: 'Campaigns',
    viewAllCampaigns: 'View all campaigns >',
    joinCampaign: 'Join Campaign',
    
    // Rewards
    redeemPoints: 'Redeem Your Points',
    viewAllOffers: 'View all offers >',
    discount: 'discount',
    
    // Settings
    language: 'Language',
    theme: 'Theme',
    notifications: 'Notifications',
    privacy: 'Privacy',
    about: 'About',
  },
  es: {
    // Navigation
    home: 'Inicio',
    missions: 'Misiones',
    map: 'Mapa',
    community: 'Comunidad',
    profile: 'Perfil',
    settings: 'Configuración',
    
    // Common
    welcome: 'Bienvenido a Climate Intel',
    loading: 'Cargando...',
    error: 'Error',
    retry: 'Reintentar',
    save: 'Guardar',
    cancel: 'Cancelar',
    done: 'Hecho',
    
    // App specific
    climateIntel: 'Climate Intel',
    climateIntelligenceNetwork: 'Red de Inteligencia Climática',
    empoweringClimateAction: 'Potenciando la Acción Climática a través de Datos',
    
    // Home page
    homeWelcome: 'Bienvenido a la Red de Inteligencia Climática',
    homeDescription: 'Equipando a los ciudadanos del Sur Global con herramientas para la justicia climática',
    
    // Missions
    activeMissions: 'Misiones Activas',
    completedMissions: 'Misiones Completadas',
    joinMission: 'Unirse a la Misión',
    
    // Advanced Missions
    allMissions: 'Todas las Misiones',
    myMissions: 'Mis Misiones',
    searchMissions: 'Buscar misiones...',
    filterBy: 'Filtrar por',
    sortBy: 'Ordenar por',
    category: 'Categoría',
    status: 'Estado',
    newest: 'Más Nuevos',
    popular: 'Popular',
    highestReward: 'Mayor Recompensa',
    dataCollection: 'Recolección de Datos',
    research: 'Investigación',
    awareness: 'Concienciación',
    action: 'Acción',
    ongoing: 'En Curso',
    completed: 'Completado',
    upcoming: 'Próximo',
    participants: 'participantes',
    daysLeft: 'días restantes',
    hoursLeft: 'horas restantes',
    viewDetails: 'Ver Detalles',
    startMission: 'Iniciar Misión',
    continueMission: 'Continuar Misión',
    missionCompleted: 'Misión Completada',
    progress: 'Progreso',
    
    // Map
    climateData: 'Datos Climáticos',
    yourLocation: 'Tu Ubicación',
    nearbyStations: 'Estaciones Cercanas',
    
    // Community
    discussions: 'Discusiones',
    events: 'Eventos',
    stories: 'Historias',
    communitySubtitle: 'Conecta, aprende y actúa juntos por el cambio climático',
    featuredCommunities: 'Comunidades Destacadas',
    recentDiscussions: 'Discusiones Recientes',
    upcomingEvents: 'Próximos Eventos',
    myCommunities: 'Mis Comunidades',
    startDiscussion: 'Iniciar Discusión',
    createEvent: 'Crear Evento',
    viewAll: 'Ver Todo',
    active: 'activos',
    view: 'Ver',
    join: 'Unirse',
    by: 'por',
    replies: 'respuestas',
    attending: 'asistiendo',
    joined: 'Unido',
    impactPoints: 'Puntos de Impacto',
    
    // Profile
    myProfile: 'Mi Perfil',
    contributions: 'Contribuciones',
    achievements: 'Logros',
    editProfile: 'Editar Perfil',
    
    // Leagues and Progress
    league: 'Liga',
    currentLeague: 'Liga Actual',
    bronzeLeague: 'Liga de Bronce',
    silverLeague: 'Liga de Plata',
    goldLeague: 'Liga de Oro',
    platinumLeague: 'Liga de Platino',
    diamondLeague: 'Liga de Diamante',
    pointsToNext: 'puntos para la siguiente liga',
    points: 'puntos',
    
    // Featured Missions
    featuredMissions: 'Misiones Destacadas',
    viewAllMissions: 'Ver todas las misiones >',
    event: 'Evento',
    task: 'Tarea',
    beginner: 'Principiante',
    intermediate: 'Intermedio',
    advanced: 'Avanzado',
    expert: 'Experto',
    
    // Campaigns
    campaigns: 'Campañas',
    viewAllCampaigns: 'Ver todas las campañas >',
    joinCampaign: 'Unirse a Campaña',
    
    // Rewards
    redeemPoints: 'Canjea tus Puntos',
    viewAllOffers: 'Ver todas las ofertas >',
    discount: 'descuento',
    
    // Settings
    language: 'Idioma',
    theme: 'Tema',
    notifications: 'Notificaciones',
    privacy: 'Privacidad',
    about: 'Acerca de',
  },
  pt: {
    // Navigation
    home: 'Início',
    missions: 'Missões',
    map: 'Mapa',
    community: 'Comunidade',
    profile: 'Perfil',
    settings: 'Configurações',
    
    // Common
    welcome: 'Bem-vindo ao Climate Intel',
    loading: 'Carregando...',
    error: 'Erro',
    retry: 'Tentar novamente',
    save: 'Salvar',
    cancel: 'Cancelar',
    done: 'Concluído',
    
    // App specific
    climateIntel: 'Climate Intel',
    climateIntelligenceNetwork: 'Rede de Inteligência Climática',
    empoweringClimateAction: 'Capacitando Ação Climática através de Dados',
    
    // Home page
    homeWelcome: 'Bem-vindo à Rede de Inteligência Climática',
    homeDescription: 'Equipando cidadãos do Sul Global com ferramentas para justiça climática',
    
    // Missions
    activeMissions: 'Missões Ativas',
    completedMissions: 'Missões Concluídas',
    joinMission: 'Participar da Missão',
    
    // Advanced Missions
    allMissions: 'Todas as Missões',
    myMissions: 'Minhas Missões',
    searchMissions: 'Buscar missões...',
    filterBy: 'Filtrar por',
    sortBy: 'Ordenar por',
    category: 'Categoria',
    status: 'Status',
    newest: 'Mais Recentes',
    popular: 'Popular',
    highestReward: 'Maior Recompensa',
    dataCollection: 'Coleta de Dados',
    research: 'Pesquisa',
    awareness: 'Conscientização',
    action: 'Ação',
    ongoing: 'Em Andamento',
    completed: 'Concluído',
    upcoming: 'Próximo',
    participants: 'participantes',
    daysLeft: 'dias restantes',
    hoursLeft: 'horas restantes',
    viewDetails: 'Ver Detalhes',
    startMission: 'Iniciar Missão',
    continueMission: 'Continuar Missão',
    missionCompleted: 'Missão Concluída',
    progress: 'Progresso',
    
    // Map
    climateData: 'Dados Climáticos',
    yourLocation: 'Sua Localização',
    nearbyStations: 'Estações Próximas',
    
    // Community
    discussions: 'Discussões',
    events: 'Eventos',
    stories: 'Histórias',
    communitySubtitle: 'Conecte-se, aprenda e aja juntos pela mudança climática',
    featuredCommunities: 'Comunidades em Destaque',
    recentDiscussions: 'Discussões Recentes',
    upcomingEvents: 'Próximos Eventos',
    myCommunities: 'Minhas Comunidades',
    startDiscussion: 'Iniciar Discussão',
    createEvent: 'Criar Evento',
    viewAll: 'Ver Todos',
    active: 'ativos',
    view: 'Ver',
    join: 'Juntar-se',
    by: 'por',
    replies: 'respostas',
    attending: 'participando',
    joined: 'Juntou-se',
    impactPoints: 'Pontos de Impacto',
    
    // Profile
    myProfile: 'Meu Perfil',
    contributions: 'Contribuições',
    achievements: 'Conquistas',
    editProfile: 'Editar Perfil',
    
    // Leagues and Progress
    league: 'Liga',
    currentLeague: 'Liga Atual',
    bronzeLeague: 'Liga de Bronze',
    silverLeague: 'Liga de Prata',
    goldLeague: 'Liga de Ouro',
    platinumLeague: 'Liga de Platina',
    diamondLeague: 'Liga de Diamante',
    pointsToNext: 'pontos para a próxima liga',
    points: 'pontos',
    
    // Featured Missions
    featuredMissions: 'Missões em Destaque',
    viewAllMissions: 'Ver todas as missões >',
    event: 'Evento',
    task: 'Tarefa',
    beginner: 'Iniciante',
    intermediate: 'Intermediário',
    advanced: 'Avançado',
    expert: 'Especialista',
    
    // Campaigns
    campaigns: 'Campanhas',
    viewAllCampaigns: 'Ver todas as campanhas >',
    joinCampaign: 'Participar da Campanha',
    
    // Rewards
    redeemPoints: 'Resgate seus Pontos',
    viewAllOffers: 'Ver todas as ofertas >',
    discount: 'desconto',
    
    // Settings
    language: 'Idioma',
    theme: 'Tema',
    notifications: 'Notificações',
    privacy: 'Privacidade',
    about: 'Sobre',
  },
};

const i18n = new I18n(translations);

// Set the locale to English by default
i18n.locale = 'en';

// When a value is missing from a language it'll fall back to another language with the key present.
i18n.enableFallback = true;

export default i18n;
