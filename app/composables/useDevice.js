export const useDevice = () => {
  const { width, height } = useWindowSize()

  const isMobile = computed(() => width.value < 768)
  const isTablet = computed(() => width.value >= 768 && width.value < 1150)
  const isDesktop = computed(() => width.value >= 1150)

  return {
    width,
    height,
    isMobile,
    isTablet,
    isDesktop
  }
}
