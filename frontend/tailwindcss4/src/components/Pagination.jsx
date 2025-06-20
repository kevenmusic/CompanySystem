import { Button, ButtonGroup, Flex, Text } from '@chakra-ui/react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

export default function Pagination({ metaData, onPageChange, pageSize }) {
  const { CurrentPage, TotalPages, HasPrevious, HasNext } = metaData;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= TotalPages) {
      onPageChange(page);
    }
  };

  // Создаем массив номеров страниц для отображения (например, 1, 2, 3, ..., 10)
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, CurrentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(TotalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <Flex alignItems="center" justifyContent="center" gap={2} className="mt-4">
      <Button
        leftIcon={<FaArrowLeft />}
        colorScheme="teal"
        size="sm"
        onClick={() => handlePageChange(CurrentPage - 1)}
        isDisabled={!HasPrevious}
        className="flex items-center"
      >
        Предыдущая
      </Button>

      <ButtonGroup>
        {getPageNumbers().map(page => (
          <Button
            key={page}
            colorScheme={page === CurrentPage ? 'teal' : 'gray'}
            size="sm"
            onClick={() => handlePageChange(page)}
            className="flex items-center"
          >
            {page}
          </Button>
        ))}
      </ButtonGroup>

      <Button
        rightIcon={<FaArrowRight />}
        colorScheme="teal"
        size="sm"
        onClick={() => handlePageChange(CurrentPage + 1)}
        isDisabled={!HasNext}
        className="flex items-center"
      >
        Следующая
      </Button>

      <Text className="ml-4">
        Страница {CurrentPage} из {TotalPages}
      </Text>
    </Flex>
  );
}