import { useEffect, useState } from "preact/hooks";
import Icon from "site/components/ui/Icon.tsx";

interface Author {
  name: string;
  verifiedBuyer: boolean;
}

interface AggregateRating {
  ratingValue: number;
  reviewCount: number;
}

export interface ReviewsTabTexts {
  verifiedPurchases: string;
  sortBy: string;
  date: string;
  rating: string;
  writeReview: string;
  shareOpinions: string;
  mainComments: string;
  noComments: string;
  reviewSingular: string;
  reviewPlural: string;
  stars: string;
}

interface Review {
  id: string;
  reviewHeadline: string;
  reviewBody: string;
  author: Author[];
  datePublished: string;
  reviewRating: AggregateRating;
}

export const RatingsBar = ({
  value,
  size,
}: {
  value: number;
  size?: number;
}) => {
  return (
    <div className={`flex ${size}`}>
      {Array.from({ length: 5 }, (_, i) => i + 1).map((star) => (
        <span key={star}>
          <Icon
            id="Star"
            size={size}
            className={`${star === 5 ? "mr-0" : "mr-0"} ${
              star <= value
                ? "text-[#ED9D00]"
                : "text-transparent stroke-gray-300"
            }`}
            strokeWidth={0.1}
          />
        </span>
      ))}
    </div>
  );
};

export const ReviewsSummary = ({
  rating,
  totalReviews,
  inline = false,
}: {
  rating: number;
  totalReviews: number;
  inline?: boolean;
}) => {
  return (
    <div
      className={`flex ${
        inline ? "flex-row items-center space-x-2" : "flex-col items-center"
      }`}
    >
      <div className={`flex items-center ${inline ? "mb-0" : "mb-4"}`}>
        <RatingsBar value={rating} size={inline ? 20 : 27} />
      </div>
      <p className={`${inline ? "ml-2" : "text-center"}`}>
        {totalReviews} {totalReviews === 1 ? "avaliação" : "avaliações"}
      </p>
    </div>
  );
};

const StarRatingDistribution = ({
  reviewsData,
  onFilterByRating,
}: {
  reviewsData: Review[];
  onFilterByRating: (rating: number) => void;
}) => {
  const starCounts = Array(5).fill(0);
  reviewsData.forEach((review) => {
    const ratingIndex =
      Math.min(Math.floor(review.reviewRating.ratingValue), 5) - 1;
    starCounts[ratingIndex]++;
  });

  const totalReviews = reviewsData.length;

  return (
    <div className="w-full">
      {[...starCounts].reverse().map((count, index) => {
        const rating = 5 - index;
        const percentage = totalReviews ? (count / totalReviews) * 100 : 0;
        return (
          <div
            key={rating}
            className="flex items-center mb-1 w-full cursor-pointer hover:text-[#ED9D00]"
            onClick={() => onFilterByRating(rating)}
          >
            <div className="text-sm mr-1 w-20 text-end">{rating} estrelas</div>
            <div className="flex-1 bg-gray-200 min-w-[20px] h-1 relative">
              <div
                className="bg-[#ED9D00] h-1"
                style={{ width: `${percentage}%` }}
              >
              </div>
            </div>
            <div className="ml-1 md:ml-2 text-sm w-20">
              {percentage.toFixed(1)}% ({count})
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex justify-center space-x-2">
      {currentPage > 1 && (
        <button className="px-4 py-2 bg-[#f0f0f0]" onClick={handlePrevious}>
          &lt;
        </button>
      )}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          className={`px-4 py-2 ${
            page === currentPage
              ? "bg-[#cbffe8] text-green-800"
              : "bg-[#f0f0f0]"
          }`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      {currentPage < totalPages && (
        <button className="px-4 py-2 bg-[#f0f0f0]" onClick={handleNext}>
          &gt;
        </button>
      )}
    </div>
  );
};

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  return new Date(dateString).toLocaleDateString("pt-BR", options);
};

export interface Props {
  reviewsData?: Review[];
  texts: ReviewsTabTexts;
}

function ReviewsTab({ reviewsData, texts }: Props) {
  const [filteredReviews, setFilteredReviews] = useState<Review[]>(
    reviewsData || [],
  );
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [sortOrder, setSortOrder] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);

  const REVIEWS_PER_PAGE = 10;

  const totalReviews = filteredReviews.length;
  const totalPages = Math.ceil(totalReviews / REVIEWS_PER_PAGE);
  const averageRating = reviewsData
    ? reviewsData.reduce(
      (acc, review) => acc + review.reviewRating.ratingValue,
      0,
    ) / (reviewsData.length || 1)
    : 0;

  useEffect(() => {
    if (!reviewsData) return;

    let filtered = reviewsData.slice();
    if (showVerifiedOnly) {
      filtered = filtered.filter((review) =>
        review.author.some((author) => author.verifiedBuyer)
      );
    }

    if (ratingFilter !== null) {
      filtered = filtered.filter(
        (review) =>
          Math.floor(review.reviewRating.ratingValue) === ratingFilter,
      );
    }

    switch (sortOrder) {
      case "date":
        filtered.sort((a, b) => {
          const diff = new Date(a.datePublished).getTime() -
            new Date(b.datePublished).getTime();
          return sortDirection === "asc" ? diff : -diff;
        });
        break;
      case "rating":
        filtered.sort((a, b) => {
          const diff = a.reviewRating.ratingValue - b.reviewRating.ratingValue;
          return sortDirection === "asc" ? diff : -diff;
        });
        break;
    }

    setFilteredReviews(filtered);
    setCurrentPage(1);
  }, [reviewsData, showVerifiedOnly, sortOrder, sortDirection, ratingFilter]);

  const displayedReviews = filteredReviews.slice(
    (currentPage - 1) * REVIEWS_PER_PAGE,
    currentPage * REVIEWS_PER_PAGE,
  );

  const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortOrder = (e.target as HTMLSelectElement).value;
    if (sortOrder === newSortOrder) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortOrder(newSortOrder);
      setSortDirection("desc");
    }
  };

  const handleFilterByRating = (rating: number) => {
    setRatingFilter(rating);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-4 md:p-4 p-0">
      <div className="flex flex-col justify-center h-full">
        <div className="flex flex-col md:flex-row justify-center md:justify-between items-center h-full">
          <div className="flex-1 flex justify-center items-center">
            <ReviewsSummary
              rating={averageRating}
              totalReviews={reviewsData?.length || 0}
            />
          </div>
          <div className="flex-1 flex justify-center items-center mt-4 md:mt-0">
            <StarRatingDistribution
              reviewsData={reviewsData || []}
              onFilterByRating={handleFilterByRating}
            />
          </div>
        </div>

        <div className="flex flex-col justify-center items-center p-6 bg-white my-8">
          <a
            href="https://www.granado.com.br/granado/customer/account/login/"
            className="bg-green-800 text-white py-3 px-4 rounded border border-transparent hover:bg-white
          hover:text-green-800 hover:border-green-800 
          text-[18px] w-[300px] text-center mb-4"
            title="Escreva uma avaliação"
          >
            {texts.writeReview}
          </a>
          <p className="text-[#1D1D1D] font-matria fonte-normal text-sm">
            {texts.shareOpinions}
          </p>
        </div>
      </div>

      <p className="pb-5 text-[22px] text-center">
        {texts.mainComments}
      </p>

      <div className="flex flex-col items-center  py-4 md:px-5 mt-5 mb-[25px] bg-white">
        <div className="flex flex-col md:flex-row justify-between w-full">
          <label className="hidden md:flex items-center pl-4 mb-4 md:mb-0">
            <input
              type="checkbox"
              checked={showVerifiedOnly}
              onChange={(e) =>
                setShowVerifiedOnly((e.target as HTMLInputElement).checked)}
            />{" "}
            <span className="ml-2 text-xs font-matria">
              {texts.verifiedPurchases}
            </span>
          </label>
          <div className="flex items-center justify-center md:pl-8 md:ml-8 ">
            <span className="mr-2 text-[#363636] text-sm font-matria">
              {texts.sortBy}
            </span>
            <div>
              <select
                value={sortOrder}
                onChange={handleSortOrderChange}
                className="mx-2.5 px-2 py-2 pr-8 border border-[#CFCFCF] rounded text-sm text-[#999999] font-matria outline-none focus:ring-0 appearance-none bg-white bg-no-repeat w-[150px]"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%231D1D1D' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-chevron-down'><polyline points='6 9 12 15 18 9'/></svg>\")",
                  backgroundPosition: "right 0.5rem center",
                  backgroundSize: "12px 12px",
                }}
              >
                <option value="date">{texts.date}</option>
                <option value="rating">{texts.rating}</option>
              </select>
            </div>
            <button
              onClick={() =>
                setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
              className="ml-2 text-[#1D1D1D]"
            >
              <Icon
                id="SortDown"
                strokeWidth={0.1}
                width={18}
                height={18}
                className={`text-[#999999] hover:text-[#008060]  ${
                  sortDirection === "asc" ? "rotate-180" : "rotate-0"
                } transition-colors duration-300`}
              />
            </button>
          </div>
        </div>
        {displayedReviews.length !== 0 && (
          <div className="md:hidden w-full flex justify-center">
            <hr className="mt-6 border-t border-[#E3E3E3] w-[90%]" />
          </div>
        )}
        {displayedReviews.length === 0 && (
          <div className="flex flex-col justify-center items-center w-full">
            <div className="w-full flex justify-center">
              <hr className="mt-6 border-t border-[#E3E3E3] w-[90%]" />
            </div>
            <p className="space-x-2 text-base font-normal font-matria text-[#1D1D1D] text-center mb-2">
              {texts.noComments}
            </p>
          </div>
        )}
        <label className="flex md:hidden items-start justify-start pl-4 mb-4 md:mb-0 w-full mt-6">
          <input
            type="checkbox"
            checked={showVerifiedOnly}
            onChange={(e) =>
              setShowVerifiedOnly((e.target as HTMLInputElement).checked)}
          />{" "}
          <span className="ml-2 text-xs font-matria">
            {texts.verifiedPurchases}
          </span>
        </label>
      </div>

      {displayedReviews.length > 0 &&
        (
          displayedReviews.map((review) => (
            <div
              key={review.id}
              className="border-b pt-6 pb-6 flex flex-col md:flex-row"
            >
              <div className="flex-shrink-0 w-full md:w-[30%] mb-4 md:mb-0">
                {review.author.map((author, index) => (
                  <div
                    key={index}
                    className="text-base font-normal font-matria flex flex-row md:flex-col justify-between pr-2 md:pr-0"
                  >
                    {author.name}
                    <div className={`flex flex-col-reverse md:flex-col`}>
                      {author.verifiedBuyer && (
                        <div className="flex items-center space-x-1">
                          <span className="text-[#909090] text-sm font-normal font-matria">
                            {texts.verifiedPurchases}
                          </span>
                          <Icon id="CheckCircle" size={12} strokeWidth={0.1} />
                        </div>
                      )}

                      <div className="text-black text-base font-normal font-matria">
                        {formatDate(review.datePublished)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex-1 min-h-[102px]">
                <RatingsBar value={review.reviewRating.ratingValue} size={18} />
                <p className="text-base font-normal font-matria mt-3">
                  {review.reviewBody}
                </p>
              </div>
            </div>
          ))
        )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <div className="flex items-center gap-2 bg-yellow-50 p-4 mb-4  text-amber-700">
        <Icon id="AlertWarning" size={24} />
        <p className="text-sm">
          Somente usuários cadastrados podem escrever avaliações. Por favor,
          {" "}
          <a href="/login" className="text-blue-600 hover:underline">
            faça seu login
          </a>{" "}
          ou{" "}
          <a href="/cadastro" className="text-blue-600 hover:underline">
            cadastre-se
          </a>
        </p>
      </div>
    </div>
  );
}

export default ReviewsTab;
