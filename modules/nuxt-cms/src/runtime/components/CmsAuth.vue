<script lang="ts" setup>
import { useCms } from '#imports'

withDefaults(
  defineProps<{
    login?: string
    logout?: string
  }>(), {
  login: 'Log In',
  logout: 'Log Out',
})

const {user, onLogin, onLogout } = useCms()
</script>

<template>
  <ClientOnly>
    <slot :on-login="onLogin" :on-logout="onLogout" :user="user">
      <button @click="!user ? onLogin : onLogout">
        <span>{{ !user ? login : logout }}</span>
      </button>
    </slot>
  </ClientOnly>
</template>
