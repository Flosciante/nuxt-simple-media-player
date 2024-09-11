<template>
  <header :class="$style.header">
    <div :class="$style['header-inner']">
      <div :class="$style['logo-container']">
        <Logo />
      </div>
      <slot name="search" />
      <UAvatar src="https://avatars.githubusercontent.com/u/6696789?v=4" :class="$style.avatar" />
    </div>
    <div :class="$style['header-title']">
      <h1>Your Tracks</h1>
    </div>
  </header>
</template>

<style module lang="postcss">
.header {
  height: 15rem;
  padding-left: 1rem;
  padding-right: 1rem;
  background-image: linear-gradient(to top, rgb(15 23 42), rgb(30 41 59));
  padding-top: 2rem;
}

.header-inner {
  display: flex;
  justify-content: between;
  gap: 1rem;
  position: relative;
}

.logo-container {
  width: 5rem;
  position: absolute;
  left: 0;
  justify-content: left;
}

.avatar {
  width: 5rem;
  position: absolute;
  right: 0;
  justify-content: end;
}

.header-title {
  display: flex;
  align-items: center;
  height: 100%;
  padding-top: 3rem;
}

h1 {
  font-size: 4.5rem;
  font-weight: bold;
  color: white;
}

@media (min-width: 1024px) {
  .avatar {
    width: 15rem;
  }

  .logo-container {
    width: 15rem;
  }
}

@media (min-width: 768px) {
  .logo-container {
    width: 10rem;
  }
}
</style>