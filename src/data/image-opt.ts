import { cdnSrcSet, cdnUrl } from "@/lib/cdn";

export type ImageOpt = { stem: string; width: number; height: number; sizes: number[]; lqip: string };
export const IMAGE_OPT: Record<string, ImageOpt> = {
  "/images/action-2.jpg": {
    stem: "action-2",
    width: 1600,
    height: 1066,
    sizes: [480, 800, 1280, 1600],
    lqip: "data:image/webp;base64,UklGRpIAAABXRUJQVlA4IIYAAADQAwCdASoYABAAPzGAt1KuqCUisAgB0CYJYgC7ACEX61L4L61pgYAA/up7P6o8dYysMtViUvzre2U9rX1jkV3eJauje0ow9ylBb9ug5wz+saT5aefEk+ljH8UBhsN1e3Pdr3MSuZ7rw0VmCsxqA9VNIkvq+uhDzxRkRqXPQGG23dD7tEAAAA==",
  },
  "/images/aerial.jpg": {
    stem: "aerial",
    width: 1686,
    height: 3000,
    sizes: [480, 800, 1280, 1686],
    lqip: "data:image/webp;base64,UklGRp4AAABXRUJQVlA4IJIAAADwBACdASoYACsAPzGOvVguqaYjpWsx0CYJYgDDcApBf7lpEDB9o8ZM8xHtzR0Dk4AA9DHfqCadmPLrds3ap6bajrSicQnp82GIhhl7DZx9tKcKoIHBTo5jzY5V6x9wAdWQmikL9CFGnqE4PFaf740/KUTKCSb4+a1Cg7PeuX3syP8vp48yKHuQClT+5C1hqguAAA==",
  },
  "/images/camp-1.jpg": {
    stem: "camp-1",
    width: 1280,
    height: 720,
    sizes: [480, 800, 1280],
    lqip: "data:image/webp;base64,UklGRo4AAABXRUJQVlA4IIIAAAAQBACdASoYAA4APzGAt1KuqCUisAgB0CYJbACdABtdbRe4dgRZy0yrcAD+qZbykMNvsMwvuuX5y8XDlzYrjOdQxwOe4j4CfEV587P1iCenoDITRR5IYaXY5uuwv62QjXSVWVClbkQXzq8vI39ji6s4wuO154PX5bXNjFpOhjHOhpAA",
  },
  "/images/camp-2.jpg": {
    stem: "camp-2",
    width: 1280,
    height: 720,
    sizes: [480, 800, 1280],
    lqip: "data:image/webp;base64,UklGRoIAAABXRUJQVlA4IHYAAADwAwCdASoYAA4APzGCuVMuqKWisAgB0CYJaACdAB06bwOAVjLX7qRcAOHIcjxZemkBR4p0Aor8j6SIDurkciw+YZQsa7I+WHwK0OvLMcEj6hB5SYgpcbo9r1pEuvnzFyxkOkziP3lwQRkNSG/ld0hW51XwFkAA",
  },
  "/images/camp-3.jpg": {
    stem: "camp-3",
    width: 1024,
    height: 683,
    sizes: [480, 800, 1024],
    lqip: "data:image/webp;base64,UklGRmoAAABXRUJQVlA4IF4AAACwAwCdASoYABAAPzGAt1MuqCUisAgB0CYJYwDCgCHDivFVtSbH8gD8e78JINSS+5ktzIzI3F1ddKN9+yWFo6xRzTTXbXmectnoh8t0xECxJGKyVd31zap2A9FeAAAA",
  },
  "/images/camp-4.jpg": {
    stem: "camp-4",
    width: 1600,
    height: 1065,
    sizes: [480, 800, 1280, 1600],
    lqip: "data:image/webp;base64,UklGRowAAABXRUJQVlA4IIAAAADwAwCdASoYABAAPzGAt1KuqCUisAgB0CYJZgCw7BgPnE6xjO+dr7owAP7MLFh3GSFEdfMdFuDk/PbO9tgLDXLY4yraSLtK1ZSxoPguR+Ol/3iTFQ7ckOD8nixcWeJWJWEzrSAd9TKsI4grjlddoSdRalvbmV/UrJ9e/LLCHMBAAA==",
  },
  "/images/card-lanzarote.jpg": {
    stem: "card-lanzarote",
    width: 1600,
    height: 1200,
    sizes: [480, 800, 1280, 1600],
    lqip: "data:image/webp;base64,UklGRmwAAABXRUJQVlA4IGAAAADQBACdASoYABIAPzGEtVKuqSUisBgMAdAmCUAToAFCAavoDS6K78I/y4MJoKdugAD5qHEtSyq1Apo+fVhsotCr1Jk4w7tchJ8YEDEeaRUIwAdr6AI/n1eCbZUoE8ewKAA=",
  },
  "/images/coach-1.jpg": {
    stem: "coach-1",
    width: 1333,
    height: 2000,
    sizes: [480, 800, 1280, 1333],
    lqip: "data:image/webp;base64,UklGRt4AAABXRUJQVlA4INIAAAAQBgCdASoYACQAPzF6uFMupyUisBqqqdAmCWwAgqNMZP9nxwBVcdd/PIumfUNzHrvb5XUwmLTgh4AA+muCkIAwroZmToJnn1TetoUA6J0gksP/vtGjWYcT/vN+tBjajrlj+QuzoUFvoh7XUPLw3H4Uo6501ep6GlE/52/4525OcaVlfoTChCykTRzc91xLvSmRTTjEsZvqV2CZNxKR1Zg5IAu9CdMZSsSqCwfprP1lxmHNuResZ4q2uhPN//n/2pzAYbDotJQlUjhogPfnpMAAAAA=",
  },
  "/images/coach-2.jpg": {
    stem: "coach-2",
    width: 1200,
    height: 1599,
    sizes: [480, 800, 1200],
    lqip: "data:image/webp;base64,UklGRsgAAABXRUJQVlA4ILwAAADwBACdASoYACAAPzGAtlMuqCUisAgB0CYJYgC/OBLAMve6YL1sXB/fWrsenMdJCsAA/rHw7pfgNgLIVpl+/K1nPojQe5Bh3Jp2XKGQM6ZsXanunmBO0IbgihwjM31gXU0I3whR8QQQbFqVGrv6KZNprklOYoWr8KFsSdj9b4KhEEhJCrIsYWukX8cuoA+rw7GKWIWW/LRVilg47Jv96h57VSHvA/dDv6MFGNUNrR0FLE498s4yAPnpdAAAAA==",
  },
  "/images/coach-dave.jpg": {
    stem: "coach-dave",
    width: 1200,
    height: 1600,
    sizes: [480, 800, 1200],
    lqip: "data:image/webp;base64,UklGRrgAAABXRUJQVlA4IKwAAADwBACdASoYACAAPzGOvVkuqSYjqAgB0CYJQBbdJAD34kMyiyj0jS4GS6j6i6MiawAA/upsn3hsibqaa3+RXYrQpm6VBR1jlMhu92FrIXgrBhNofjPI17un3PUYR7rWP9ByujAU4CBqspIgBEOLAl6YqHafprebj9ZjZOMNkp+7flG8hHJCXicy23iV4PhxuVO/+A0dUnKUKINMcA8uTLUoE/pzGXQqh6njXAAA",
  },
  "/images/coach-issa.jpg": {
    stem: "coach-issa",
    width: 1600,
    height: 1065,
    sizes: [480, 800, 1280, 1600],
    lqip: "data:image/webp;base64,UklGRqYAAABXRUJQVlA4IJoAAACQBACdASoYABAAPzGAt1KuqCUisAgB0CYJbACdMoADY/ATGNh1b+bvubSr1EAA/f5yW65x9bJVpRxlfdmHKVe4rsvyg54xbUIi0WKXew0mvY/LtR6t2au4f29hzNVGiaOlg8C3WLXLhoV1mEc/MBjoi6I4TaoOWYAsIijtF41sAKc6jzsnFRRdf65eqiOnJlOKz74Sg9IoAAAA",
  },
  "/images/coach-katya.jpg": {
    stem: "coach-katya",
    width: 380,
    height: 551,
    sizes: [380],
    lqip: "data:image/webp;base64,UklGRtAAAABXRUJQVlA4IMQAAADQBgCdASoYACMAPzGQvFiuqaWjpWsx0CYJQBZwBc2TRcjlWVAztw693MgOv8yAYCIFgPW7vsXzew3NCkfrhAAA/urYwPkyXXbT82r+Z3uVV0xbjHgHfPAHjRqMlnPpOtwSmUDmMb1JpChjSUNLsu+LmNoKiiP8/3ZtO2fVLWtM/RCjtCoY06NGThgLU7oljms7yy7Dn2qEVSsxKEZomq6nur9au6CRAtPc+ttO3mCaUKaniGLQlFnbh31lltyC75yDkzAA",
  },
  "/images/coach-marco.jpg": {
    stem: "coach-marco",
    width: 1050,
    height: 1400,
    sizes: [480, 800, 1050],
    lqip: "data:image/webp;base64,UklGRsYAAABXRUJQVlA4ILoAAABQBQCdASoYACAAPzGAt1MuqCUisAgB0CYJQBdgAliNE+Gds9Sn6MyaE5Xna3KoycyoSgAA/rHw7pfgNgLIVpl+/K1nPojQe5Bh3Jp2XKGQM6ZsXanunmBO0IaCiruX9hS3FBSySrgZxmJbUsXMLogdyvNAHKe99dFcSvuY85k6DpspLIJKz4FrpFdw0/ikVII+VZEa20/RsSkjYNg3NuVGQiAu+fkGPDECaxT32Ru9fGm4nAfwBbJwwAA=",
  },
  "/images/coach-mark-action.jpg": {
    stem: "coach-mark-action",
    width: 1600,
    height: 1065,
    sizes: [480, 800, 1280, 1600],
    lqip: "data:image/webp;base64,UklGRpQAAABXRUJQVlA4IIgAAACQAwCdASoYABAAPzGAt1MuqCUisAgB0CYJagC22f/gT+x9cawAAP7ajfzatoO/Nn/DUPoV+puyEZzSqVZ+qwPu1ofQmjCk1jKaVBki+HgnY/i2pswRwwezHA0JKyaaGKjngph/KWwph1E01PxJYa2Ctj9wPNPC4DQciaX8M9G/fFsnC4pSQAAA",
  },
  "/images/coach-mark-hero.jpg": {
    stem: "coach-mark-hero",
    width: 800,
    height: 1065,
    sizes: [480, 800],
    lqip: 'data:image/webp;base64,UklGRtYAAABXRUJQVlA4IMoAAADQBQCdASoYACAAPzF+tFMup6SisAgB0CYJbAC29oAAYLGuM+mpWjCjxDbvA99vw75XVYWqA0KoAP67+AanmatS5VS1+dnkQ8QTIYII8I6nsBBUtWg8MXyLNDR51vBaGbtnSmBhqIujlj9WQrhFpDdbTQIIDF5Q/pYWQbPQ3gjlbc7bBATuoCZKD9ExgaExg4+6+j0SCzb+Muwm9wXu0dvqJTrFwz7gNLVnhH0lpUSGMt4x1sCYgGKyajTk7xNxQtu9iYTA2+R8RwAA',
  },
  "/images/coach-mark.jpg": {
    stem: "coach-mark",
    width: 580,
    height: 844,
    sizes: [480, 580],
    lqip: "data:image/webp;base64,UklGRvwAAABXRUJQVlA4IPAAAABwBgCdASoYACMAPy10sVKupiSitVgMAdAliWYAuzOOwf29JxR/g6a2iig+q2Fd9eRD/Ttq3RQShj85pQAAzjq/6x5s1JvUoKxaau2VhsQDrhShg6liz4b93UM+YJUCRSRSLiqr7c+8n2sEeX2wv8j46WdYoBK0+dkm1gTtNdQEiwA2SPzED4GNpECv5A9Pj5xuXzO6wh9h5RGH34SGGqdXy4OawBMq8Qxi60ktbzlw/0E2zMgDBhxqUuC5BzGIY0Mlib+ffUBnDljQoxq3+ihAn/73G9KO13p/hDjDHiuJHIqb9mrGT9RVZPp6lJ1HAAA=",
  },
  "/images/coach-martha.jpg": {
    stem: "coach-martha",
    width: 529,
    height: 793,
    sizes: [480, 529],
    lqip: "data:image/webp;base64,UklGRhIBAABXRUJQVlA4IAYBAABwBgCdASoYACQAPzGGtlSuqSSjKqwB0CYJagCviAwtrAcaNYUfYfXlYUQrKrYtS1hRncQWHjRscHIpcgAA/fK5squ7G76CRpIOZd8lm+Wc8i80bzlqLADXetnJGW6qYCknriHxbxbVkM/bmYAIt4sQsM7urMxO1rKDNwoZ52hhGCVYnHNclXRgwm6FyUJtfwE0+8/j+ZyEW1ZKIuVAT4aVjqvc1vtDDK1RY/edbxeY4c3DvW3LiIpbG1ERFDEwUHrGYzTZkQ9TVsadHP1HyDj4z8CoRKXnZydWe+DUqYI57Xk9DTSVPyeNM0O6N5nsIjXKcU9wFZmxy/JvISlpZZJwTi+c/AAA",
  },
  "/images/dig.jpg": {
    stem: "dig",
    width: 1600,
    height: 1066,
    sizes: [480, 800, 1280, 1600],
    lqip: "data:image/webp;base64,UklGRmoAAABXRUJQVlA4IF4AAACQAwCdASoYABAAPzGAt1KuqCUisAgB0CYJQBOgBDN6xs5sK/gAAP7DkRJDxyjWavoGYTFpUwNMovRwTGAWMgCQdSDQoMi9hgANtoneyQO8+cpmNBvLR245k08IzwAA",
  },
  "/images/gallery-1.jpg": {
    stem: "gallery-1",
    width: 1600,
    height: 900,
    sizes: [480, 800, 1280, 1600],
    lqip: "data:image/webp;base64,UklGRpwAAABXRUJQVlA4IJAAAABQBACdASoYAA4APzGAt1MuqCUisAgB0CYJbACdMoACbvzIDv7ojzMCNX8AAPfAaWXW+A9krBhpbeyv6kiF50YT57XdhRprsLAu4JjDfrb3C4TRoL19D8t3UJZvAtozaDiKyS0U/P1A7eYbH+Q/W5xr7onsaTRyYpqahkaDVSoBapzeMIvjMJcME15IX1fowAA=",
  },
  "/images/gallery-2.jpg": {
    stem: "gallery-2",
    width: 1472,
    height: 828,
    sizes: [480, 800, 1280, 1472],
    lqip: "data:image/webp;base64,UklGRngAAABXRUJQVlA4IGwAAAAQAwCdASoYAA4APzGAt1MuqCUisAgB0CYJQBbZAKYJpHAA/odrYRcw9km4YSqUs5DAB0m9rhpE1raWyhSbTbfDlFhEHasYIbDw0kP111t8DymWjn9O+Hk6uFUThungi1e+gmszfcHa5iTwAAA=",
  },
  "/images/golf.jpg": {
    stem: "golf",
    width: 1600,
    height: 1034,
    sizes: [480, 800, 1280, 1600],
    lqip: "data:image/webp;base64,UklGRngAAABXRUJQVlA4IGwAAACwAwCdASoYABAAPzGCt1KuqKUisAgB0CYJQApgAPPUV3PWjoewvAD6n0/6ZypJfgrsfkV76TA8TUGdjhvDy/CNuMGkR/pjdOhQgUFuGduNsZ+h+SOPOZEdnP+tMO810PCr958gJBvwSKWEcAA=",
  },
  "/images/group.jpg": {
    stem: "group",
    width: 1920,
    height: 1278,
    sizes: [480, 800, 1280, 1920],
    lqip: "data:image/webp;base64,UklGRpAAAABXRUJQVlA4IIQAAACQAwCdASoYABAAPzGAt1MuqCUisAgB0CYJagC22f/gULSXxZQAAP7ajfzatW/5/iCUWMKKP+h4/aMjvG7L7S87Wh9CaMKTWMppUGSL4Xgv4sP14WlaoN+gHfSovUN3am58DBNzsR2havMlq8ytroZoNrm/10xPzZ0M/34+t9xMoUaF4AA=",
  },
  "/images/hero-home.jpg": {
    stem: "hero-home",
    width: 1920,
    height: 1080,
    sizes: [480, 800, 1280, 1920],
    lqip: "data:image/webp;base64,UklGRnoAAABXRUJQVlA4IG4AAAAQBACdASoYAA4APzGAt1MuqCUisAgB0CYJZACuHBeXbmnl9fzVRwcszAD+gO4NXzlo2cd6Y7GqKuOv3TsITynH4B/r0eVebazI5dLQpIfh5sefcm+7A0l/V7zbWF9U3uVq8zABo0kmW/Y23POAAA==",
  },
  "/images/hero-lanzarote.jpg": {
    stem: "hero-lanzarote",
    width: 1920,
    height: 1280,
    sizes: [480, 800, 1280, 1920],
    lqip: "data:image/webp;base64,UklGRnAAAABXRUJQVlA4IGQAAACwAwCdASoYABAAPzGAt1MuqCUisAgB0CYJZgCdABQanPpSHoixIAD+0Dl09uJ9IMNWJtudwQP6x8uJa1Xh58NBmAsxnhbqqFrguUeSseDJof6KYJJRJ1ZfnWIqfQQ6NyqUFYAA",
  },
  "/images/kit-shorts.jpg": {
    stem: "kit-shorts",
    width: 1408,
    height: 1408,
    sizes: [480, 800, 1280, 1408],
    lqip: "data:image/webp;base64,UklGRkAAAABXRUJQVlA4IDQAAADQAgCdASoYABgAPzGSwFiuqiaqKAgB0CYJaQAAPaOgAP7tlnMpTqNLLVauqzoOa/MUM4AA",
  },
  "/images/kit-vest-back.jpg": {
    stem: "kit-vest-back",
    width: 1152,
    height: 1714,
    sizes: [480, 800, 1152],
    lqip: "data:image/webp;base64,UklGRmoAAABXRUJQVlA4IF4AAADQAwCdASoYACQAPzGOvlguqaYjpWsx0CYJYgDRRDmMzTz797jh/AAA/u4ffeKusDul9ff95jS9Vhwz9zptnkFrUB2nCQVObaOlly1wzHXh7k4sYyr6lMhWEq0nUAAA",
  },
  "/images/kit-vest-front.jpg": {
    stem: "kit-vest-front",
    width: 1152,
    height: 1728,
    sizes: [480, 800, 1152],
    lqip: "data:image/webp;base64,UklGRn4AAABXRUJQVlA4IHIAAADwBACdASoYACQAPzGEtlKuqKUitVQIAdAmCWwAxNgLN0WtV1pEuQg7epDGX1m3pqAA/ujWs8yTAkNbSA+zaqbqWBtEjx/ACL14wphHQhPN49I2mof+yvFjtsW0NRbkjunSqYTkeGjiLIZSsGJxjOZN0AA=",
  },
  "/images/ocean.jpg": {
    stem: "ocean",
    width: 1600,
    height: 1066,
    sizes: [480, 800, 1280, 1600],
    lqip: "data:image/webp;base64,UklGRmIAAABXRUJQVlA4IFYAAAAQBACdASoYABAAPzGAt1KuqCUisAgB0CYJZACsACHXhUsYojwR2STLAAD+w0MvNpG5OqseD37CQdqpAo8DfgGiMFOM4d2ZsuDK5pfKNds8po7rkAAAAA==",
  },
  "/images/padel.jpg": {
    stem: "padel",
    width: 1600,
    height: 900,
    sizes: [480, 800, 1280, 1600],
    lqip: "data:image/webp;base64,UklGRnoAAABXRUJQVlA4IG4AAABQBACdASoYAA4APzGAt1KuqCUisAgB0CYJbACdMoGv/gN6kajmWZtIJEoAAPuAGrhyKW0Y18M2W00bvxW1yblrZQD+97msvbkSX32oc7EHvC/B4KUs+RsnKeMt+RwGMa+T8Uymm+9kBxkyUZYAAA==",
  },
  "/images/padel-play.jpg": {
    stem: "padel-play",
    width: 1080,
    height: 864,
    sizes: [480, 800, 1080],
    lqip: "data:image/webp;base64,UklGRngAAABXRUJQVlA4IGwAAAAwBACdASoUABAAPzGAt1MuqCUisAgB0CYJYgC/WIjBxeuvaCBQI+mi+oAA/oJP6VTPULaBb5J8ppXuZ28wl4j+TIInfM/Un00QFbJ21lMC9ZKo6eszhUYEHfjOfnKa8xwezcIUI8l1LEgP7AA=",
  },
  "/images/partner-1.jpg": {
    stem: "partner-1",
    width: 1600,
    height: 1200,
    sizes: [480, 800, 1280, 1600],
    lqip: "data:image/webp;base64,UklGRo4AAABXRUJQVlA4IIIAAADQBACdASoYABIAPzGKu1cuqSWjqAqp0CYJYgDA3AuRMiwU2uWCqcS1NWS/OWdzUAD+v3mMVZo/YgG8IcyuvBG9SilLCxr5Z52UV20yf4kG+knVOeqKIiRozpF9GlbiO9HujXUCGQhB4XWgPsJNQXNqyfS6aAOC9D1sbZPDFvTSAAAA",
  },
  "/images/partner-2.jpg": {
    stem: "partner-2",
    width: 1600,
    height: 1300,
    sizes: [480, 800, 1280, 1600],
    lqip: "data:image/webp;base64,UklGRtwAAABXRUJQVlA4INAAAAAwBQCdASoYABQAPzGMuFeuqSSjqAqp0CYJbADKEfVF2AEohhRsh5b+77Ddthp1l3JGAAD+50DCtRSD9a0GvPM/I8Tb4Sk2CqNw4Vx5Bq7weTbX4v/T3CkQscR2EqG0KrqOoGMs6QGoG6/AvnoVhvKndwbDm4lmsKvdR7xv6alIVw+nTT35iPufUyU0IA+26YT/X7diabJeMprSS6KbVATvl15uc7IhxpnGby6xOQ8ZnwvsqbAi15vPdfBqYw3ip1fI1KVwRVMQl3rGyOCHQAAA",
  },
  "/images/portrait-1.jpg": {
    stem: "portrait-1",
    width: 1600,
    height: 2133,
    sizes: [480, 800, 1280, 1600],
    lqip: "data:image/webp;base64,UklGRuQAAABXRUJQVlA4INgAAABQBQCdASoYACAAPzF+tFMup6SisAgB0CYJbADA3y6AKJWvlyjlUrsP5JWstDPgRLpnmoAA/nglYyyD6N/TtX/RyoMaj6MUFeCSc+zI9A6A6kr5muzHy+jgiDIIN/z1r/RWfPJZi2MmNBvgrb5KXH0/VH/ZgCXpGOqRFYAbbvUBaDLCgSh2/5cn2xmPrHL8bBlI5fYBcGmgBGrD003Tl3eWiebd/CBTgAvzboidNe9wm5iONo5UeBfWsePShB/Vio3DczMU/m6HloDijASf6tVdsBNpGSQAAAA=",
  },
  "/images/portrait-2.jpg": {
    stem: "portrait-2",
    width: 1600,
    height: 2133,
    sizes: [480, 800, 1280, 1600],
    lqip: "data:image/webp;base64,UklGRrgAAABXRUJQVlA4IKwAAAAQBQCdASoYACAAPzGOvViuqaYjqAgB0CYJQBbZCtoLcXMb0h3GyLDVEtzTkLMHwmEAAP7qZGGY+pGX3cvLisiIvREf54xB/4q+Uq9daw371GCF6Asm0sxj2FgOuXuzW/0HL7anUv/sa4zKZxGad/Rixqqk+ynRfxvWgFVCoHG3os7KZ4yPvlmblf7Ef1Eev2Z6NDniKAp9TCPHv3rCnLUFZRhAIH01iTPTfKgA",
  },
  "/images/portrait-ella.jpg": {
    stem: "portrait-ella",
    width: 933,
    height: 1400,
    sizes: [480, 800, 933],
    lqip: "data:image/webp;base64,UklGRt4AAABXRUJQVlA4INIAAAAwBgCdASoYACQAPzF6uFMupyWisBqqqdAmCWwAeLnD+z44Cc17zj7ygrxn1Dcx7IaEbJFTdIt8mxPAAPpfoKU1VlqDzDkzCAgySwRhK33pGgB/9IMYLNg9b/ejjnaVZyediut1sotud9Cxl11MKBh5+vfKbZwVZQ3iDNSCnDhjVxtaTrwlXAX/HB8xDLDS4l3plC9dKIW0wuPW5n7Biqyrp2bdUjHuPGW/nt2AttIOzfbLhDxWAA/8MDV6GC9yFXRFYiruAfMoQwuAlQwrG3ngAAA=",
  },
  "/images/set-1.jpg": {
    stem: "set-1",
    width: 1600,
    height: 1065,
    sizes: [480, 800, 1280, 1600],
    lqip: "data:image/webp;base64,UklGRowAAABXRUJQVlA4IIAAAABQAwCdASoYABAAPzGAt1KuqCUisAgB0CYJagCo9ALk5mueAAD+LZDLrb660pknZJP6QrZ6MkL5/vrBkN+p3vReUXhhhcGNqURmdCKt0bPgHRVwmufH4oMrP37jpVcJcKWnRWO0qh23Cy2bIBTu3aXdCuO+nWNtvt0+e3OIqAAAAA==",
  },
  "/images/set-2.jpg": {
    stem: "set-2",
    width: 1600,
    height: 1065,
    sizes: [480, 800, 1280, 1600],
    lqip: "data:image/webp;base64,UklGRpAAAABXRUJQVlA4IIQAAAAwBACdASoYABAAPzGAt1MuqCUisAgB0CYJZAC7AB9O7bP2gpspO1pTlIAA/njDW8MYsrKvuQlfPIbspPnJJr+37amERm+BwjUUHI4erYrLTtt0IZcRc4Pe10xXCx+qTF93W5PsVtTITBVoZZTw3G+HwDSscp4rrjeZW5mZCIFhRbWAAAA=",
  },
  "/images/spike.jpg": {
    stem: "spike",
    width: 1600,
    height: 1065,
    sizes: [480, 800, 1280, 1600],
    lqip: "data:image/webp;base64,UklGRqQAAABXRUJQVlA4IJgAAABwBACdASoYABAAPzGAt1KuqCUisAgB0CYJbACdMoADY/ATGNh1b+bvubR6OAD9/nJbrnH1slWlHGV92YcpV7iuy/KDnjFtQiLRYpd7DSa9j8u1Hq3Zq7h/b2HM1UaJo6WDwLdYtcuGhXWYRz8wGOiLojhNqg5ZgCwiKPT4D8ajqtjbKxScVFF1/rl6qI6cmU4rPvhKDhgAAA==",
  },
  "/images/sunset.jpg": {
    stem: "sunset",
    width: 1600,
    height: 1065,
    sizes: [480, 800, 1280, 1600],
    lqip: "data:image/webp;base64,UklGRp4AAABXRUJQVlA4IJIAAAAQBACdASoYABAAPzGAt1KuqCUisAgB0CYJQBjeg8wCmJ5u+v/NCH0EAAD+38MTEOIW+WgtZPeiXKUcUaovOPLtKwo8SPLr/ziPkpX6hdVhaOhv2FyK4+yvz2Mam8Gqcl1nKozmKTtY7KDzz9NRnKC8Vrs/3T5An2q/2SumnEKyEwlFOOnJ4hIOXoCTjmM4agAAAA==",
  },
  "/images/tennis-clay.jpg": {
    stem: "tennis-clay",
    width: 1600,
    height: 974,
    sizes: [480, 800, 1280, 1600],
    lqip: "data:image/webp;base64,UklGRm4AAABXRUJQVlA4IGIAAAAwBACdASoYAA8APzGCt1KuqKUisAgB0CYJZgCdMoMwtEtpgCN/kCqAGCIA/mUbZftbwfwTHu19a4saBntJBuXvKNlM0lnFZ2WO0kQo1pMjrUBlsgZxqmucJ8aNmP7e5uAAAA==",
  },
  "/images/tennis-court.jpg": {
    stem: "tennis-court",
    width: 1600,
    height: 1068,
    sizes: [480, 800, 1280, 1600],
    lqip: "data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAACwAwCdASoYABAAPzGCt1MuqKUisAgB0CYJbACdMoRwADc7fjncAAD+0jKFbTxgD4LD/XZS2O0y1/Celz9cjPHD6hfO8cgEik1gsa7ER07GuXfUgAA=",
  },
  "/images/tennis-player.jpg": {
    stem: "tennis-player",
    width: 1080,
    height: 620,
    sizes: [480, 800, 1080],
    lqip: "data:image/webp;base64,UklGRnwAAABXRUJQVlA4IHAAAAAQBACdASoYAA4APzGAt1MuqCUisAgB0CYJQBXDgs7ACWK2rOKNsa1QIAD9RzBkW8tteJEIzmmCQKNFgwom/nRcFyEUhebbgpQW/f9xaGNSRnWLu4Wx0hyBwvHKRy7tsASbVzB8FQd1OqNH2JBQkwAA",
  },
  "/images/tennis.jpg": {
    stem: "tennis",
    width: 1600,
    height: 974,
    sizes: [480, 800, 1280, 1600],
    lqip: "data:image/webp;base64,UklGRm4AAABXRUJQVlA4IGIAAAAwBACdASoYAA8APzGCt1KuqKUisAgB0CYJZgCdMoMwtEtpgCN/kB+FogAA/mUbZftbwfwTHu19a4saBntJBuXvKNktx9XT8+SQJU6lppGix1SKufgOR+yAtcC0TWE7sp4AAA==",
  },
  "/images/tennis-open.jpg": {
    stem: "tennis-open",
    width: 1080,
    height: 810,
    sizes: [480, 800, 1080],
    lqip: "data:image/webp;base64,UklGRqoAAABXRUJQVlA4IJ4AAACwBACdASoYABIAPymKvFguKSWjqAgBwCUJQBhQAVa0e3OxDQ5A14M3R18B8I0AAP6g3o4OdGlLNPWcZr2+asPIBJRDpZuP7TLr9hG1wZmtyeGc4jXeO1suGZ8mQn1UnSt0OJ4EZW6xV7usOYpk6GbTIEM/Q2SrqUpX10rnverzQsBG8AGEZUzjKr8w+T6RRhP9jrL7IaSgVlstEA6oAA==",
  },
  "/images/padel-courts.jpg": {
    stem: "tennis-open",
    width: 1080,
    height: 810,
    sizes: [480, 800, 1080],
    lqip: "data:image/webp;base64,UklGRqoAAABXRUJQVlA4IJ4AAACwBACdASoYABIAPymKvFguKSWjqAgBwCUJQBhQAVa0e3OxDQ5A14M3R18B8I0AAP6g3o4OdGlLNPWcZr2+asPIBJRDpZuP7TLr9hG1wZmtyeGc4jXeO1suGZ8mQn1UnSt0OJ4EZW6xV7usOYpk6GbTIEM/Q2SrqUpX10rnverzQsBG8AGEZUzjKr8w+T6RRhP9jrL7IaSgVlstEA6oAA==",
  },
  "/images/hv_stock_padel_community_45_001.jpg": {
    stem: "hv_stock_padel_community_45_001",
    width: 1080,
    height: 1350,
    sizes: [480, 800, 1080],
    lqip: "data:image/webp;base64,UklGRhoBAABXRUJQVlA4IA4BAAAQBgCdASoYAB4APxFwr1AsJiQisAgBgCIJZgC7BAgBVXde5tFkGYtxZM54uZ5HM58Du5GnTnsw4HQA/d9Qkg62KM784RxpcYVuUvLiJqd8MGHCeCyvDPi3XZIiJo8WI3sErlTBYkxifvmD1urFor6J/v2uSFdtrqh2lAraIgtGBOPf8iFMepWPuR2WOlh7KzfGtj7WoB5DKUayZxbtP7A13Cy4ZXxVI8xvUz3RFLT2Or3532xTdgErBEMvMiqzvBqrYDmO4RruT9MSjEmwt+QSYZoilMDuDbRdXzqXONpCJJMUQX9LsSB6Bmp209ICeW7rTNMIlK/U1B9eCDZ4xtQ9epgAxWpBxGQ2IlSYAAA=",
  },
  "/images/Hv_Lanzarote_2026_Pro_Destination_012.jpg": {
    stem: "Hv_Lanzarote_2026_Pro_Destination_012",
    width: 2000,
    height: 1333,
    sizes: [480, 800, 1280, 1600, 2000],
    lqip: "data:image/webp;base64,UklGRoIAAABXRUJQVlA4IHYAAAAwBACdASoYABAAPxFysFAsJqSisAgBgCIJZACdMoMqmE5dtFuZAWkapKAA/o1uA6XIL8x0BhG8vDThctIrzEVQs6MrX7q3nB8HIHZ2a6HlyH773dZnE9ORy+KSVztK93GIxJXHjHxaL4dNS78FhNnIKZ2LnhAA",
  },
  "/images/DSC_2551.jpg": {
    stem: "DSC_2551",
    width: 2000,
    height: 1333,
    sizes: [480, 800, 1280, 1600, 2000],
    lqip: "data:image/webp;base64,UklGRqYAAABXRUJQVlA4IJoAAACQBACdASoYABAAPxFysFAsJqSisAgBgCIJbACdMoADgp/CjbVVXe0w8qA3JEAA/tJkJ/U+v7aW5F/KHLqTzNijqQ2zZdMd6hWoh3jL6O5RzfDT0Ka3SohoULtFk5EB4HlskvmcxgYssKglHWHxNz0xNIHykQYZLnLzsKZdEPQf/mcW4p5qLZbc8k1dvkskyOS3uKCVIAsAlOAA",
  },
};

export function imageOpt(src: string) {
  const path = src.split("?")[0];
  return IMAGE_OPT[path] ?? IMAGE_OPT[path.replace(/^https?:\/\/[^/]+/, "")] ?? null;
}

export function webpSrcSet(src: string) {
  const meta = imageOpt(src);
  if (!meta) return undefined;
  return cdnSrcSet(meta.sizes.map((w) => `/images/opt/${meta.stem}-${w}.webp ${w}w`).join(", "));
}

export function webpHref(src: string, want = 1280) {
  const meta = imageOpt(src);
  if (!meta) return cdnUrl(src);
  const w = [...meta.sizes].reverse().find((n) => n <= want) ?? meta.sizes.at(-1) ?? meta.sizes[0];
  return cdnUrl(`/images/opt/${meta.stem}-${w}.webp`);
}
