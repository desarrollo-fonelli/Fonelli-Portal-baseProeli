export interface TemplateLlamada {
    Codigo:     number;
    Mensaje:    string;
    Contenido:  TemplatePortal;
}

export interface TemplatePortal {
    Video:                Video;
    BannerPrincipal:      Banner[];
    Gif:                  GIF;
    Nosotros:             Nosotros;
    ImagenFinal:          ImagenFinal;
    BannerDistribuidores: Banner[];
    BannerAsesores:       Banner[];
}

export interface Video {
    Url:    string;
    Video: string;
}


export interface Banner {
    Titulo:      string;
    Link:        string;
    UrlImagen:      string;
    Imagen:      string;
    UrlImagenMovil: string;
    ImagenMovil: string;
    Orden:       string;
    nuevaImagen?:    any;
    nuevaImagenMovil?:    any;  
    bImagen?:    boolean|false;
    bImagenMovil?:    boolean|false;  
    fileBanner?:    any;
    fileBannerMovil?:    any;         
    
}

export interface GIF {
    Url:            string;
    Imagen1:        string;
    TextoSuperior1: string;
    TextoInferior1: string;
    Imagen2:        string;
    TextoSuperior2: string;
    TextoInferior2: string;
    Imagen3:        string;
    TextoSuperior3: string;
    TextoInferior3: string;
}

export interface ImagenFinal {
    Url:    string;
    Imagen: string;
}

export interface Nosotros {
    Url:     string;
    Imagen1: string;
    Imagen2: string;
    Imagen3: string;
    Imagen4: string;
    Texto:   string;
}
