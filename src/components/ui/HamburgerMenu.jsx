{/* Admin */}
{isAdmin && (
  <div className="space-y-3 pt-4 border-t border-gray-200">

    <Link
      to={`/${clubSlug}/admin`}
      onClick={closeMenu}
      className="block text-gray-900 text-base font-semibold"
    >
      Admin Dashboard
    </Link>

    <Link
      to={`/${clubSlug}/admin/events`}
      onClick={closeMenu}
      className="block text-gray-900 text-base"
    >
      Event Manager
    </Link>

    <Link
      to={`/${clubSlug}/admin/calendar`}
      onClick={closeMenu}
      className="block text-gray-900 text-base"
    >
      Calendar Manager
    </Link>

    <Link
      to={`/${clubSlug}/admin/membership`}
      onClick={closeMenu}
      className="block text-gray-900 text-base"
    >
      Membership Manager
    </Link>

    <Link
      to={`/${clubSlug}/admin/news`}
      onClick={closeMenu}
      className="block text-gray-900 text-base"
    >
      News Panel
    </Link>

    <Link
      to={`/${clubSlug}/admin/settings`}
      onClick={closeMenu}
      className="block text-gray-900 text-base"
    >
      Club Settings
    </Link>
  </div>
)}
