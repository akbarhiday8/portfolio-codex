import React from 'react'

const Skeleton = ({ type }) => {
  const projectSkeleton = (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shadow-md animate-pulse">
      <div className="aspect-video bg-gray-200 dark:bg-gray-700"></div>
      <div className="p-6">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
        <div className="flex flex-wrap gap-2 mt-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          ))}
        </div>
      </div>
    </div>
  );

  const toolSkeleton = (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 flex items-center gap-4 shadow-md animate-pulse">
      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      <div className="flex-1">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>
  );

  switch (type) {
    case 'project':
      return projectSkeleton;
    case 'tool':
      return toolSkeleton;
    default:
      return null;
  }
};

export default Skeleton; 