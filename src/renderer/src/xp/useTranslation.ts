import { useSystemSettings } from './SystemSettings'

const dictionary: Record<string, Record<string, string>> = {
  pt: {
    'Start': 'Iniciar',
    'My Computer': 'Meu Computador',
    'Recycle Bin': 'Lixeira',
    'Control Panel': 'Painel de Controle',
    'Turn Off Computer': 'Desligar computador',
    'Restart': 'Reiniciar',
    'Cancel': 'Cancelar',
    'Log Off': 'Fazer logoff',
    'Programs': 'Todos os Programas'
  },
  en: {
    'Start': 'Start',
    'My Computer': 'My Computer',
    'Recycle Bin': 'Recycle Bin',
    'Control Panel': 'Control Panel',
    'Turn Off Computer': 'Turn Off Computer',
    'Restart': 'Restart',
    'Cancel': 'Cancel',
    'Log Off': 'Log Off',
    'Programs': 'All Programs'
  },
  es: {
    'Start': 'Inicio',
    'My Computer': 'Mi PC',
    'Recycle Bin': 'Papelera',
    'Control Panel': 'Panel de Control',
    'Turn Off Computer': 'Apagar equipo',
    'Restart': 'Reiniciar',
    'Cancel': 'Cancelar',
    'Log Off': 'Cerrar sesión',
    'Programs': 'Todos los programas'
  },
  fr: {
    'Start': 'Démarrer',
    'My Computer': 'Poste de travail',
    'Recycle Bin': 'Corbeille',
    'Control Panel': 'Panneau de configuration',
    'Turn Off Computer': 'Arrêter l\'ordinateur',
    'Restart': 'Redémarrer',
    'Cancel': 'Annuler',
    'Log Off': 'Fermer la session',
    'Programs': 'Tous les programmes'
  },
  ru: {
    'Start': 'Пуск',
    'My Computer': 'Мой компьютер',
    'Recycle Bin': 'Корзина',
    'Control Panel': 'Панель управления',
    'Turn Off Computer': 'Выключение',
    'Restart': 'Перезагрузка',
    'Cancel': 'Отмена',
    'Log Off': 'Выйти',
    'Programs': 'Все программы'
  },
  zh: {
    'Start': '开始',
    'My Computer': '我的电脑',
    'Recycle Bin': '回收站',
    'Control Panel': '控制面板',
    'Turn Off Computer': '关闭计算机',
    'Restart': '重新启动',
    'Cancel': '取消',
    'Log Off': '注销',
    'Programs': '所有程序'
  }
}

export function useTranslation() {
  const { settings } = useSystemSettings()
  const lang = settings.language || 'pt'

  const t = (key: string): string => {
    return dictionary[lang]?.[key] || key
  }

  return { t, lang }
}
