(function (app) {
  const STORAGE = {
    venues: "postovaya.venues",
    audiences: "postovaya.audiences",
    drafts: "postovaya.drafts",
    sidebarCollapsed: "postovaya.sidebarCollapsed",
  };

  const DEFAULT_POST_STYLES = [
    "Фирменный: говорить голосом заведения и раскрыть инфоповод через его характер",
    "Афиша: быстро обозначить событие, конкретные детали и повод прийти",
    "Атмосфера: передать ощущение места через детали, ритм и визуальные образы",
    "Продукт в фокусе: показать блюдо или предложение через вкус и конкретную пользу",
    "История: начать с наблюдения или небольшого сюжета и мягко привести к теме",
  ];

  const defaults = {
    venues: [
      { id: "v1", name: "Тесто и огонь · Центр", description: "Семейная итальянская траттория в центре города. Открытая кухня, пицца из дровяной печи.", voice: "Тепло, аппетитно, без пафоса. Говорим как радушный хозяин." },
      { id: "v2", name: "Тесто и огонь · Набережная", description: "Просторный ресторан сети с видом на воду, вечерней программой и летней террасой.", voice: "Атмосферно и уверенно, с акцентом на повод выбраться из дома." },
    ],
    audiences: [
      { id: "a1", venueId: "v1", name: "Семьи с детьми", description: "Родители 28–42 лет, которые выбирают понятное место для семейного обеда или ужина.", needs: "Комфорт для детей, предсказуемое качество, возможность спокойно провести время." },
      { id: "a2", venueId: "v1", name: "Офисные команды рядом", description: "Специалисты 23–40 лет из офисов в пешей доступности.", needs: "Быстро, вкусно, понятная цена и возможность прийти компанией." },
      { id: "a3", venueId: "v2", name: "Пары для вечернего выхода", description: "Гости 25–38 лет, которые ищут место для свидания или неформального вечера.", needs: "Атмосфера, визуальная подача, напитки и ощущение особенного вечера." },
    ],
  };

  function load(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) || fallback;
    } catch {
      return fallback;
    }
  }

  function save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  const state = {
    venues: load(STORAGE.venues, defaults.venues),
    audiences: load(STORAGE.audiences, defaults.audiences),
    drafts: load(STORAGE.drafts, []),
    imageUrl: null,
    imageName: "",
    profileVenueId: "",
    editingVenueId: "",
    editingAudienceId: "",
    research: null,
  };

  function migrateAudienceOwnership() {
    const legacy = state.audiences.filter(item => !item.venueId);
    if (!legacy.length || !state.venues.length) return;

    const linked = state.audiences.filter(item => item.venueId);
    state.venues.forEach(venue => {
      legacy.forEach(item => linked.push({ ...item, id: crypto.randomUUID(), venueId: venue.id }));
    });
    state.audiences = linked;
    save(STORAGE.audiences, state.audiences);
  }

  function audiencesForVenue(venueId) {
    return state.audiences.filter(item => item.venueId === venueId);
  }

  migrateAudienceOwnership();
  state.profileVenueId = state.venues[0]?.id || "";

  app.store = { STORAGE, DEFAULT_POST_STYLES, state, save, audiencesForVenue };
})(window.Postovaya = window.Postovaya || {});
