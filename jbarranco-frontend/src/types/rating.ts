export interface Rating {
    id: string;
    clientId: string;
    clientName: string;
    employeeId: string;
    employeeName: string;
    jobId: string; // ID del trabajo relacionado
    stars: StarRating; // Rating general
    categories: {
        puntualidad: StarRating;
        calidad: StarRating;
        trato: StarRating;
    };
    comment?: string;
    createdAt: Date;
}

export type StarRating = 1 | 2 | 3 | 4 | 5;

export interface RatingStats {
    employeeId: string;
    employeeName: string;
    totalRatings: number;
    averageStars: number;
    averageCategories: {
        puntualidad: number;
        calidad: number;
        trato: number;
    };
    recentRatings: Rating[];
}
