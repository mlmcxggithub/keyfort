import { getCategories } from "@/actions/category-action";
import {
  getPasswordCollection,
  totalUserPasswordSaved,
} from "@/actions/password-action";
import AddNewPasswordDialog from "@/components/add-new-password-dialog";
import Header from "@/components/header";
import PasswordCollectionCard from "@/components/password-collection-card";
import SearchPassword from "@/components/search-password";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

interface DashboardPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
  }>;
}

interface PasswordCollection {
  id: string;
  websiteName: string;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
  password: string;
  email: string | null;
  username: string | null;
  url: string | null;
  userId: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

const DashboardPage = async ({ searchParams }: DashboardPageProps) => {
  const resolvedSearchParams = await searchParams; // Resolve the Promise

  // Explicitly type the destructured result
  const [passwordsCollection, categories, total]: [
    PasswordCollection[],
    Category[],
    number,
  ] = await Promise.all([
    getPasswordCollection({
      category: resolvedSearchParams.category || "",
      search: resolvedSearchParams.search || "",
    }),
    getCategories(),
    totalUserPasswordSaved(),
  ]);

  return (
    <>
      <Header
        title="All Passwords"
        description="Safely manage and access your passwords."
        className="mt-5"
      />

      <div className="mb-6 flex items-center space-x-3">
        <SearchPassword total={total} />
        <AddNewPasswordDialog categories={categories} />
      </div>

      <div className="space-y-2.5">
        {!passwordsCollection.length ? (
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>No Password Found</AlertTitle>
            <AlertDescription>
              Looks like you haven&apos;t added any passwords yet.
            </AlertDescription>
          </Alert>
        ) : (
          passwordsCollection.map((collection) => {
            const categoryObject = categories.find(
              (cat) => cat.id === collection.categoryId,
            );

            if (!categoryObject) {
              console.error(
                `Category with ID ${collection.categoryId} not found`,
              );
            }

            return (
              <PasswordCollectionCard
                key={collection.id}
                password={{
                  ...collection,
                  category: categoryObject || {
                    id: collection.categoryId,
                    name: "Unknown",
                    slug: "unknown",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  },
                  createdAt: new Date(collection.createdAt),
                  updatedAt: new Date(collection.updatedAt),
                  email: collection.email ?? null,
                  username: collection.username ?? null,
                  url: collection.url ?? null,
                }}
                categories={categories}
              />
            );
          })
        )}
      </div>
    </>
  );
};

export default DashboardPage;
