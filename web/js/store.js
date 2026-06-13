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
    venues: [],
    audiences: [],
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
