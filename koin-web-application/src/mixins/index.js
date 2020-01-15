
export const closeSearchBarAction={
  methods:{
    closeSearchBar() {
      if (window.innerWidth > 576)
        this.$store.dispatch("toggleSearchBarAction", false);
    },
  }
};
